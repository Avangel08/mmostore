<?php

namespace App\Traits;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

trait ApiResourceResponse
{
    protected function success(?string $message = 'Success', array|Collection|JsonResource $resourceData = [], int $code = Response::HTTP_OK)
    {
        if ($resourceData instanceof JsonResource) {
            $resourceData = $resourceData->response()->getData(true);
        }
        return response()->json([
            'status' => 'success',
            'message' => $message ?? 'Success',
            ...($resourceData),
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
