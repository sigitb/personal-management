<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use function Laravel\Prompts\info;

trait LogActivity
{
    public static function bootLogActivity()
    {
        static::created(function ($model) {
            static::logActivity($model, 'created');
        });

        static::updating(function ($model) {
            info($model);
            static::logActivity($model, 'updated', $model->getOriginal());
        });

        static::deleted(function ($model) {
            static::logActivity($model, 'deleted', $model->getOriginal());
        });
    }

    protected static function logActivity($model, string $action, $oldData = null)
    {
        try {
            ActivityLog::create([
                'activitable_type' => get_class($model),
                'activitable_id'  => $model->id ?? null,
                'action'     => $action,
                'before_data'   => $oldData,
                'after_data'   => in_array($action, ['created', 'updated'])
                    ? $model->getAttributes()
                    : null,
                'user_id'    => Auth::user()->id ?? null,
                'created_at' => now()
            ]);
        } catch (\Exception $e) {
            info($e->getMessage());
        }
    }

}
