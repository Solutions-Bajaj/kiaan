
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
 * Load the module's JavaScript with configuration
 * @return void
 */
function kiaan_crm_load_js()
{
    // Add configuration variables to be used by the widget
    $config = [
        'chatWebhookUrl' => get_option('kiaan_chat_webhook_url'),
        'agentIdChat' => get_option('kiaan_agent_id_chat'),
        'agentIdMeeting' => get_option('kiaan_agent_id_meeting'),
        'primaryColor' => get_option('kiaan_primary_color') ?: '#60a5fa',
        'secondaryColor' => get_option('kiaan_secondary_color') ?: '#34d399',
        'footerText' => get_option('kiaan_footer_text') ?: 'Powered by Solutions Bajaj',
        'footerLink' => get_option('kiaan_footer_link') ?: 'https://solutionsbajaj.com',
    ];
    
    echo '<script>window.kiaanConfig = ' . json_encode($config) . ';</script>';
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

    // Check for permissions
    if (has_permission('kiaan_crm', '', 'view')) {
        $CI->app_menu->add_sidebar_menu_item('kiaan-crm', [
            'name'     => _l('kiaan_voice_assistant'),
            'href'     => admin_url('kiaan_crm/settings'),
            'position' => 66,
            'icon'     => 'fa fa-microphone',
        ]);
    }
}

// Ensure the Kiaan module is shown in modules list
hooks()->add_filter('module_kiaan_crm_action_links', 'module_kiaan_crm_action_links');

function module_kiaan_crm_action_links($actions)
{
    $actions[] = '<a href="' . admin_url('kiaan_crm/settings') . '">' . _l('settings') . '</a>';
    return $actions;
}
