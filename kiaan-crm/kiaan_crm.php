
<?php

defined('BASEPATH') or exit('No direct script access allowed');

/*
Module Name: Kiaan Voice Assistant
Description: Integrate the Kiaan Voice & Chat Assistant with Perfex CRM
Version: 1.0.0
Requires at least: 2.3.*
Author: Solutions Bajaj
Author URI: https://solutionsbajaj.com
*/

// Define module name constant
define('KIAAN_CRM_MODULE_NAME', 'kiaan_crm');

// Register activation hook
register_activation_hook(KIAAN_CRM_MODULE_NAME, 'kiaan_crm_activation_hook');

// Hook for including the module assets
hooks()->add_action('app_admin_footer', 'kiaan_crm_load_js');
hooks()->add_action('app_admin_head', 'kiaan_crm_load_css');

/**
 * Load the module's CSS
 * @return void
 */
function kiaan_crm_load_css()
{
    echo '<link href="' . module_dir_url(KIAAN_CRM_MODULE_NAME, 'assets/css/kiaan-widget.css') . '" rel="stylesheet" type="text/css" />';
}

/**
 * Load the module's JavaScript
 * @return void
 */
function kiaan_crm_load_js()
{
    echo '<script src="' . module_dir_url(KIAAN_CRM_MODULE_NAME, 'assets/js/config.js') . '"></script>';
    echo '<script src="' . module_dir_url(KIAAN_CRM_MODULE_NAME, 'assets/js/kiaan-widget.js') . '"></script>';
}

/**
 * Module activation hook
 * @return void
 */
function kiaan_crm_activation_hook()
{
    $CI = &get_instance();
    require_once(__DIR__ . '/install.php');
}

/**
 * Register language files
 */
register_language_files(KIAAN_CRM_MODULE_NAME, [KIAAN_CRM_MODULE_NAME]);

/**
 * Register module menu item in sidebar
 */
hooks()->add_action('admin_init', 'kiaan_crm_add_admin_menu_item');

/**
 * Add menu item
 */
function kiaan_crm_add_admin_menu_item()
{
    $CI = &get_instance();

    if (has_permission('kiaan_crm', '', 'view')) {
        $CI->app_menu->add_sidebar_menu_item('kiaan-crm', [
            'name'     => _l('kiaan_voice_assistant'),
            'href'     => admin_url('kiaan_crm/settings'),
            'position' => 66,
            'icon'     => 'fa fa-microphone',
        ]);
    }
}
