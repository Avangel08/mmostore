<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        $this->shouldRenderJsonWhen(function () use ($request, $e) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });

        return parent::render($request, $e);
    }

    protected function convertExceptionToArray(Throwable $e)
    {
        return [
            'status' => 'error',
            ...parent::convertExceptionToArray($e)
        ];
    }

    protected function invalidJson($request, ValidationException $exception)
    {
        return response()->json([
            'status' => 'error',
            'message' => $exception->getMessage(),
            'errors' => $exception->errors(),
        ], $exception->status);
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return $this->shouldReturnJson($request, $exception)
            ? response()->json([
                'status' => 'error',
                'message' => $exception->getMessage()
            ], 401)
            : redirect()->guest($exception->redirectTo($request) ?? route('login'));
    }
}
