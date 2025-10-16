<?php

namespace App\Services\PersonalAccessToken;

use App\Models\Mongo\PersonalAccessToken;
use App\Models\Mongo\Customers;
use DateTimeInterface;

class PersonalAccessTokenMongoService
{
    public function findById($id, $select = ["*"], $relation = [])
    {
        return PersonalAccessToken::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function deleteById($id)
    {
        return PersonalAccessToken::where('_id', $id)->delete();
    }

    public function userCreateToken(Customers $user, $tokenName, $abilities = ['*'], ?DateTimeInterface $expiresAt = null)
    {
        return $user->createToken($tokenName, $abilities, $expiresAt)->plainTextToken;
    }

    public function userGetFirstToken(Customers $user, $select = ["*"])
    {
        return $user->tokens()->select($select)->first();
    }

    public function userRevokeAllTokens(Customers $user)
    {
        $user->tokens()->delete();
    }

    public function userGetAllTokens(Customers $user, $select = ["*"])
    {
        return $user->tokens()->select($select)->get();
    }

    public function userDeleteToken(Customers $user, $tokenId)
    {
        return $user->tokens()->where('_id', $tokenId)->delete();
    }
}
