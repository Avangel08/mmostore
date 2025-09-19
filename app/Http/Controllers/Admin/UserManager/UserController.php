<?php

namespace App\Http\Controllers\Admin\UserManager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserManagement\UserManagementRequest;
use App\Services\Home\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;

    public function __construct(
        UserService $userService
    )
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        return Inertia::render('UserManager/index', [
            'users' => fn() => $this->userService->getAll(isPaginate: true, page: $page, perPage: $perPage, relation: []),
            'detail' => fn() => $this->userService->findById(id: $request->input('id'), relation: [])
        ]);
    }

    public function add(UserManagementRequest $userRequest)
    {
        try {
            $data = $userRequest->validated();
            $this->userService->create($data);

            return redirect()->back()->with('success', "User added successfully");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function update($id, UserManagementRequest $userRequest)
    {
        try {
            $data = $userRequest->validated();
            $user = $this->userService->findById($id);

            if (!$user) {
                return redirect()->back()->with('error', "User not found");
            }

            $this->userService->update($user, $data);

            return redirect()->back()->with('success', "User updated successfully");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
