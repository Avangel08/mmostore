<?php

namespace App\Services\CustomerAccessToken;

use App\Models\Mongo\CustomerAccessToken;
use App\Models\Mongo\Customers;
use DateTimeInterface;
use Illuminate\Support\Str;

class CustomerAccessTokenService
{
    public function findById($id, $select = ["*"], $relation = [])
    {
        return CustomerAccessToken::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function userFindFirstTokenByTokenable(Customers $user, array $select = ["*"])
    {
        return CustomerAccessToken::where('tokenable_id', $user->getKey())
            ->where('tokenable_type', get_class($user))
            ->select($select)
            ->first();
    }

    public function userRevokeAllTokens(Customers $user)
    {
        $user->tokens()->delete();
    }

    public function userHasAnyToken(Customers $user): bool
    {
        return CustomerAccessToken::where('tokenable_id', $user->getKey())
            ->where('tokenable_type', get_class($user))
            ->exists();
    }

    public function userCreateTokenDirect(Customers $user, ?string $name = null, array $abilities = ['*']): string
    {
        if ($this->userHasAnyToken($user)) {
            throw new \RuntimeException('You already have a token. Please reload page to see your token');
        }

        $date = date('Ymd_His');
        $tokenName = $name ?: "token-{$date}";
        $plainTextToken = $this->generateTokenString();

        CustomerAccessToken::create([
            'tokenable_id' => $user->getKey(),
            'tokenable_type' => get_class($user),
            'name' => $tokenName,
            'token' => hash('sha256', $plainTextToken),
            'abilities' => $abilities,
            'token_plain_text' => $plainTextToken,
        ]);

        return $plainTextToken;
    }

    private function generateTokenString(): string
    {
        return sprintf(
            '%s%s%s',
            config('sanctum.token_prefix', ''),
            $tokenEntropy = Str::random(40),
            hash('crc32b', $tokenEntropy)
        );
    }
}

