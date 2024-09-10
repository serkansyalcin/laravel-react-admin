<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Task;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class TasksController extends Controller
{
    /**
     * List all resource.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request) : JsonResponse
    {
        return response()->json($this->paginatedQuery($request));
    }

    /**
     * Store a new resource.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(Request $request) : JsonResponse
    {
        $request->validate([
            'user_id' => 'required',
            'title' => 'required',
            'start_date' => 'required|date:Y-m-d|after:'.now()->format('Y-m-d'),
            'end_date' => 'required|date:Y-m-d|after:start_date',
            'description' => 'required',
            'status' => 'required',
        ]);

        $task = Task::create([
            'user_id' => $request->input('user_id'),
            'title' => $request->input('title'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'description' => $request->input('description'),
            'status' => $request->input('status'),
            'type' => $request->input('type'),
        ]);

        return response()->json($task, 201);
    }

    /**
     * Show a resource.
     *
     * @param Request $request
     * @param Task $task
     *
     * @return JsonResponse
     */
    public function show(Request $request, Task $task) : JsonResponse
    {
        return response()->json($task);
    }

    /**
     * Update a resource.
     *
     * @param Request $request
     * @param Task $task
     *
     * @return JsonResponse
     */
    public function update(Request $request, Task $task) : JsonResponse
    {
        $request->validate([
            'user_id' => 'required',
            'title' => 'required',
            'start_date' => 'required|date:Y-m-d|after:'.now()->format('Y-m-d'),
            'end_date' => 'required|date:Y-m-d|after:start_date',
            'description' => 'required',
            'status' => 'required',
        ]);

        $attributes = $request->all();
        $task->fill($attributes);
        $task->update();

        return response()->json($task);
    }

    /**
     * Destroy a resource.
     *
     * @param Request $request
     * @param Task $task
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Request $request, Task $task) : JsonResponse
    {
        $task->delete();

        return response()->json($this->paginatedQuery($request));
    }


    /**
     * Update Task Status.
     *
     * @param Request $request
     * @param Task $task
     *
     * @return JsonResponse
     */
    public function updateStatus(Request $request, Task $task): JsonResponse
    {
        $request->validate([
            'status' => 'required',
        ]);

        $attributes = $request->all();
        $task->fill($attributes);
        $task->update();

        return response()->json($task);
    }

    /**
     * Get the paginated resource query.
     *
     * @param Request $request
     *
     * @return LengthAwarePaginator
     */
    protected function paginatedQuery(Request $request) : LengthAwarePaginator
    {
        $tasks = Task::orderBy(
            $request->input('sortBy') ?? 'title',
            $request->input('sortType') ?? 'ASC'
        );

        if ($type = $request->input('title')) {
            $this->filter($tasks, 'title', $type);
        }

        if ($name = $request->input('description')) {
            $this->filter($tasks, 'description', $name);
        }

        if ($email = $request->input('start_date')) {
            $this->filter($tasks, 'start_date', $email);
        }

        if ($email = $request->input('end_date')) {
            $this->filter($tasks, 'end_date', $email);
        }

        if ($email = $request->input('status')) {
            $this->filter($tasks, 'status', $email);
        }

        return $tasks->with('user')->paginate($request->input('perPage') ?? 10);
    }
}
