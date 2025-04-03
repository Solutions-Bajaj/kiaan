
<?php

defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Get Kiaan CRM module settings
 * @return array
 */
function get_kiaan_settings()
{
    $settings = [
        'chatWebhookUrl' => get_option('kiaan_chat_webhook_url'),
        'agentIds' => [
            'chat' => get_option('kiaan_agent_id_chat'),
            'meeting' => get_option('kiaan_agent_id_meeting')
        ],
        'appearance' => [
            'primaryColor' => get_option('kiaan_primary_color') ?: '#60a5fa',
            'secondaryColor' => get_option('kiaan_secondary_color') ?: '#34d399',
            'orbMargin' => [
                'bottom' => 32,
                'right' => 32
            ]
        ],
        'branding' => [
            'footerText' => get_option('kiaan_footer_text') ?: 'Powered by Solutions Bajaj',
            'footerLink' => get_option('kiaan_footer_link') ?: 'https://solutionsbajaj.com'
        ]
    ];
    
    return $settings;
}
