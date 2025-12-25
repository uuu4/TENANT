<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'message' => 'Access denied. Admin privileges required.',
            ], Response::HTTP_FORBIDDEN);
        }

        if (!$user->isActive()) {
            return response()->json([
                'message' => 'Your account has been deactivated.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
