
<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Kiaan_crm extends AdminController
{
    public function __construct()
    {
        parent::__construct();
        $this->load->helper('kiaan_crm');
        
        // Check if user has permission to access this module
        if (!has_permission('kiaan_crm', '', 'view')) {
            access_denied('kiaan_crm');
        }
    }

    /**
     * Module settings page
     */
    public function settings()
    {
        if ($this->input->post()) {
            $data = $this->input->post();
            
            update_option('kiaan_chat_webhook_url', $data['kiaan_chat_webhook_url']);
            update_option('kiaan_agent_id_chat', $data['kiaan_agent_id_chat']);
            update_option('kiaan_agent_id_meeting', $data['kiaan_agent_id_meeting']);
            update_option('kiaan_primary_color', $data['kiaan_primary_color']);
            update_option('kiaan_secondary_color', $data['kiaan_secondary_color']);
            update_option('kiaan_footer_text', $data['kiaan_footer_text']);
            update_option('kiaan_footer_link', $data['kiaan_footer_link']);
            
            set_alert('success', _l('settings_updated'));
            redirect(admin_url('kiaan_crm/settings'));
        }
        
        $data['title'] = _l('kiaan_voice_assistant');
        $this->load->view('kiaan_crm/settings', $data);
    }
}
