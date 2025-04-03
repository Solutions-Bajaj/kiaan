
<?php

defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Create necessary permissions for the module
 */
$CI = &get_instance();
$CI->load->model('roles_model');

// Add necessary capabilities/permissions
$capabilities = [
    'view'   => _l('permission_view') . '(' . _l('permission_global') . ')',
    'create' => _l('permission_create'),
    'edit'   => _l('permission_edit'),
];

$CI->roles_model->add_permissions([
    [
        'name'         => _l('kiaan_voice_assistant'),
        'capabilities' => $capabilities,
        'feature'      => 'kiaan_crm',
    ],
]);
