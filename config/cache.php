<?php

return [
    'default' => env('CACHE_STORE', 'database'),
    'stores' => [
        'database' => ['driver' => 'database', 'connection' => env('DB_CACHE_CONNECTION'), 'table' => 'cache', 'lock_table' => 'cache_locks'],
        'file' => ['driver' => 'file', 'path' => storage_path('framework/cache/data')],
        'array' => ['driver' => 'array', 'serialize' => false],
    ],
    'prefix' => 'ruang_membaca_cache',
];
