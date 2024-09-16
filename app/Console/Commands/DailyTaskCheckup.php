<?php

namespace App\Console\Commands;

use App\Task;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DailyTaskCheckup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'daily-task:checkup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command run at midnight and checks tasks with a pending status and updates their status to in_progress if their start date is today';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        Task::where('status', 'pending')->each(function ($task) {
            if (Carbon::parse($task->start_date)->isToday()) {
                $task->status = 'in_progress';
                $task->save();
            }
        });

        return true;
    }
}
