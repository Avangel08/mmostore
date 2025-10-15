<?php

namespace App\Traits;

use Illuminate\Http\Response;

trait ApiResourceResponse
{
    protected function success(?string $message = 'Success', ?array $resourceData = [], int $code = Response::HTTP_OK)
    {
        return response()->json([
            'status' => 'success',
            'message' => $message ?? 'Success',
            ...($resourceData ?? [])
        ], $code);
    }

    protected function error(?string $message = 'An error occurred', int $code = Response::HTTP_BAD_REQUEST, $errors = null)
    {
        $response = [
            'status' => 'error',
            'message' => $message ?? 'An error occurred',
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }
}
