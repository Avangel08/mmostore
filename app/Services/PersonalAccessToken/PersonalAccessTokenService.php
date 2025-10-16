<?php

namespace App\Services\PersonalAccessToken;

use App\Models\MySQL\PersonalAccessToken;
use App\Models\MySQL\User;
use DateTimeInterface;

class PersonalAccessTokenService
{
    public function findById($id, $select = ["*"], $relation = [])
    {
        return PersonalAccessToken::select($select)->with($relation)->where('id', $id)->first();
    }

    public function deleteById($id)
    {
        return PersonalAccessToken::where('id', $id)->delete();
    }

    public function userCreateToken(User $user, $tokenName, $abilities = ['*'], ?DateTimeInterface $expiresAt = null)
    {
        return $user->createToken($tokenName, $abilities, $expiresAt)->plainTextToken;
    }

    public function userGetFirstToken(User $user, $select = ["*"])
    {
        return $user->tokens()->select($select)->first();
    }

    public function userRevokeAllTokens(User $user)
    {
        $user->tokens()->delete();
    }
}
