
<?php defined('BASEPATH') or exit('No direct script access allowed'); ?>

<?php init_head(); ?>
<div id="wrapper">
    <div class="content">
        <div class="row">
            <div class="col-md-12">
                <div class="panel_s">
                    <div class="panel-body">
                        <h4 class="no-margin"><?php echo _l('kiaan_voice_assistant_settings'); ?></h4>
                        <hr class="hr-panel-heading" />
                        <?php echo form_open(admin_url('kiaan_crm/settings')); ?>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h4>API Settings</h4>
                                <div class="form-group">
                                    <label for="kiaan_chat_webhook_url">Chat Webhook URL</label>
                                    <input type="text" class="form-control" id="kiaan_chat_webhook_url" name="kiaan_chat_webhook_url" value="<?php echo get_option('kiaan_chat_webhook_url'); ?>">
                                    <small class="text-muted">The webhook URL that will process text messages from the chat interface</small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="kiaan_agent_id_chat">Agent ID (Chat Mode)</label>
                                    <input type="text" class="form-control" id="kiaan_agent_id_chat" name="kiaan_agent_id_chat" value="<?php echo get_option('kiaan_agent_id_chat'); ?>">
                                    <small class="text-muted">The ElevenLabs agent ID for the standard voice chat mode</small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="kiaan_agent_id_meeting">Agent ID (Meeting Mode)</label>
                                    <input type="text" class="form-control" id="kiaan_agent_id_meeting" name="kiaan_agent_id_meeting" value="<?php echo get_option('kiaan_agent_id_meeting'); ?>">
                                    <small class="text-muted">The ElevenLabs agent ID for the meeting mode</small>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <h4>Appearance Settings</h4>
                                <div class="form-group">
                                    <label for="kiaan_primary_color">Primary Color</label>
                                    <input type="color" class="form-control" id="kiaan_primary_color" name="kiaan_primary_color" value="<?php echo get_option('kiaan_primary_color') ?: '#60a5fa'; ?>">
                                    <small class="text-muted">Primary gradient color used in the assistant</small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="kiaan_secondary_color">Secondary Color</label>
                                    <input type="color" class="form-control" id="kiaan_secondary_color" name="kiaan_secondary_color" value="<?php echo get_option('kiaan_secondary_color') ?: '#34d399'; ?>">
                                    <small class="text-muted">Secondary gradient color used in the assistant</small>
                                </div>
                                
                                <h4>Branding</h4>
                                <div class="form-group">
                                    <label for="kiaan_footer_text">Footer Text</label>
                                    <input type="text" class="form-control" id="kiaan_footer_text" name="kiaan_footer_text" value="<?php echo get_option('kiaan_footer_text') ?: 'Powered by Solutions Bajaj'; ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label for="kiaan_footer_link">Footer Link</label>
                                    <input type="text" class="form-control" id="kiaan_footer_link" name="kiaan_footer_link" value="<?php echo get_option('kiaan_footer_link') ?: 'https://solutionsbajaj.com'; ?>">
                                </div>
                            </div>
                        </div>
                        
                        <hr class="hr-panel-heading" />
                        
                        <div class="row">
                            <div class="col-md-12">
                                <h4>Preview</h4>
                                <p>The Kiaan voice assistant will appear as a floating orb in the bottom-right corner of your website. You can customize its appearance and behavior using the settings above.</p>
                                <img src="<?php echo module_dir_url(KIAAN_CRM_MODULE_NAME, 'assets/images/preview.png'); ?>" alt="Kiaan Voice Assistant Preview" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 5px;">
                            </div>
                        </div>
                        
                        <div class="row mtop20">
                            <div class="col-md-12">
                                <button type="submit" class="btn btn-info pull-right">Save Settings</button>
                            </div>
                        </div>
                        
                        <?php echo form_close(); ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php init_tail(); ?>
