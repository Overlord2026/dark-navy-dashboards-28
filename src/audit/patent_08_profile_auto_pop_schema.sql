-- Patent #8: LinkedIn & External Profile Data Auto-Population
-- Comprehensive SQL Schema for Professional Profile Auto-Population System
-- Created: 2025-01-11
-- Version: 1.0

-- ============================================================================
-- CORE PROFILE SOURCES WITH CONSENT AND CONFIDENCE TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS profile_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('linkedin', 'firm_directory', 'registry', 'manual', 'imported')),
    source_identifier TEXT NOT NULL, -- LinkedIn ID, Registry Number, etc.
    source_url TEXT, -- API endpoint or profile URL
    consent_granted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    consent_expires_at TIMESTAMP WITH TIME ZONE,
    field_permissions JSONB NOT NULL DEFAULT '{}', -- Field-level consent: {"name": true, "email": true, "phone": false}
    confidence_score NUMERIC(5,2) DEFAULT 0.0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    data_freshness_score NUMERIC(5,2) DEFAULT 0.0, -- Recency-based scoring
    last_synced_at TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'completed', 'failed', 'disabled')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, source_type, source_identifier)
);

CREATE INDEX idx_profile_sources_user_type ON profile_sources(user_id, source_type);
CREATE INDEX idx_profile_sources_sync_status ON profile_sources(sync_status, last_synced_at);
CREATE INDEX idx_profile_sources_consent_expiry ON profile_sources(consent_expires_at) WHERE consent_expires_at IS NOT NULL;

-- ============================================================================
-- FIELD MAPPING RULES WITH TRANSFORMATION LOGIC
-- ============================================================================

CREATE TABLE IF NOT EXISTS field_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_field TEXT NOT NULL, -- e.g., "firstName", "headline", "positions[0].title"
    target_field TEXT NOT NULL, -- e.g., "first_name", "bio", "current_title"
    source_type TEXT NOT NULL CHECK (source_type IN ('linkedin', 'cfp', 'finra', 'bar', 'cpa', 'npi')),
    transformation_rule JSONB NOT NULL DEFAULT '{}', -- Transformation functions and parameters
    confidence_threshold NUMERIC(5,2) DEFAULT 0.8 CHECK (confidence_threshold >= 0 AND confidence_threshold <= 1),
    requires_human_review BOOLEAN DEFAULT false,
    data_type TEXT DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'date', 'array', 'object', 'boolean')),
    validation_regex TEXT, -- Field validation pattern
    normalization_rules JSONB DEFAULT '{}', -- Standardization rules (e.g., phone formatting)
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_field, target_field, source_type)
);

CREATE INDEX idx_field_mapping_source ON field_mapping(source_type, source_field);
CREATE INDEX idx_field_mapping_target ON field_mapping(target_field);
CREATE INDEX idx_field_mapping_active ON field_mapping(is_active) WHERE is_active = true;

-- ============================================================================
-- ENTITY RESOLUTION GRAPH FOR MERGE CANDIDATES
-- ============================================================================

CREATE TABLE IF NOT EXISTS profile_merge_graph (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    profile_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    similarity_score NUMERIC(5,2) NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 1),
    similarity_vector JSONB NOT NULL, -- {"name": 0.95, "email": 0.8, "license": 1.0, "firm": 0.7}
    similarity_method TEXT DEFAULT 'weighted_composite',
    merge_status TEXT DEFAULT 'candidate' CHECK (merge_status IN ('candidate', 'approved', 'rejected', 'merged', 'expired')),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    merge_decision_reason TEXT,
    confidence_flags JSONB DEFAULT '{}', -- Additional confidence indicators
    temporal_score NUMERIC(5,2), -- Time-based decay scoring
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    UNIQUE(profile_1_id, profile_2_id),
    CHECK (profile_1_id != profile_2_id)
);

CREATE INDEX idx_merge_graph_similarity ON profile_merge_graph(similarity_score DESC);
CREATE INDEX idx_merge_graph_status ON profile_merge_graph(merge_status, created_at);
CREATE INDEX idx_merge_graph_reviewer ON profile_merge_graph(reviewed_by, reviewed_at);
CREATE INDEX idx_merge_graph_expiry ON profile_merge_graph(expires_at) WHERE merge_status = 'candidate';

-- ============================================================================
-- CHANGE REQUESTS WITH CONFIDENCE AND APPROVAL WORKFLOW
-- ============================================================================

CREATE TABLE IF NOT EXISTS change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    source_id UUID REFERENCES profile_sources(id),
    field_name TEXT NOT NULL,
    field_path TEXT, -- JSON path for nested fields
    current_value TEXT,
    proposed_value TEXT NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    change_type TEXT NOT NULL CHECK (change_type IN ('add', 'update', 'delete', 'merge')),
    change_reason TEXT, -- Automated or manual change reason
    requires_approval BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    applied_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'applied', 'expired')),
    rejection_reason TEXT,
    approval_notes TEXT,
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5), -- 1=highest, 5=lowest
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_change_requests_status ON change_requests(status, created_at);
CREATE INDEX idx_change_requests_profile ON change_requests(target_profile_id, status);
CREATE INDEX idx_change_requests_confidence ON change_requests(confidence_score DESC);
CREATE INDEX idx_change_requests_priority ON change_requests(priority, created_at);
CREATE INDEX idx_change_requests_expiry ON change_requests(expires_at) WHERE status = 'pending';

-- ============================================================================
-- PRIVACY CONSENTS WITH GRANULAR FIELD CONTROL
-- ============================================================================

CREATE TABLE IF NOT EXISTS privacy_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL CHECK (consent_type IN ('profile_import', 'data_sharing', 'cross_directory_publish', 'registry_verification')),
    field_permissions JSONB NOT NULL DEFAULT '{}', -- Field-level permissions with purposes
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    granted_via TEXT, -- 'web_form', 'api', 'email_confirmation'
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revocation_reason TEXT,
    legal_basis TEXT CHECK (legal_basis IN ('consent', 'legitimate_interest', 'contract', 'legal_obligation')), -- GDPR Article 6
    processing_purposes TEXT[] DEFAULT '{}', -- GDPR Article 13 purposes
    data_categories TEXT[] DEFAULT '{}', -- Categories of personal data
    third_parties TEXT[] DEFAULT '{}', -- Third parties with data access
    retention_period INTERVAL, -- Data retention period
    withdrawal_method TEXT, -- How consent can be withdrawn
    consent_receipt_id TEXT, -- Unique consent receipt identifier
    ip_address INET, -- IP address when consent was granted
    user_agent TEXT, -- Browser/app information
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_privacy_consents_user ON privacy_consents(user_id, consent_type);
CREATE INDEX idx_privacy_consents_expiry ON privacy_consents(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_privacy_consents_revoked ON privacy_consents(revoked_at) WHERE revoked_at IS NOT NULL;
CREATE INDEX idx_privacy_consents_legal_basis ON privacy_consents(legal_basis);

-- ============================================================================
-- CROSS-DIRECTORY PUBLISHING QUEUE
-- ============================================================================

CREATE TABLE IF NOT EXISTS directory_publish_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_directory TEXT NOT NULL CHECK (target_directory IN ('linkedin', 'firm_website', 'marketplace', 'cfp_directory', 'finra_directory')),
    target_directory_config JSONB DEFAULT '{}', -- Directory-specific configuration
    field_mapping JSONB NOT NULL, -- Field transformations for target directory
    publish_status TEXT DEFAULT 'queued' CHECK (publish_status IN ('queued', 'processing', 'published', 'failed', 'cancelled')),
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    error_code TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    publish_type TEXT DEFAULT 'full' CHECK (publish_type IN ('full', 'incremental', 'delete')),
    diff_payload JSONB, -- Only changed fields for incremental publishes
    external_id TEXT, -- ID assigned by target directory
    webhook_url TEXT, -- Callback URL for status updates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_publish_queue_status ON directory_publish_queue(publish_status, scheduled_for);
CREATE INDEX idx_publish_queue_profile ON directory_publish_queue(profile_id, target_directory);
CREATE INDEX idx_publish_queue_priority ON directory_publish_queue(priority, scheduled_for);
CREATE INDEX idx_publish_queue_retry ON directory_publish_queue(retry_count, max_retries);

-- ============================================================================
-- REGISTRY VERIFICATION RESULTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS verification_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    registry_type TEXT NOT NULL CHECK (registry_type IN ('cfp', 'finra', 'bar', 'cpa', 'npi', 'nmls', 'sec')),
    registry_id TEXT, -- Professional's ID in the registry
    verification_status TEXT NOT NULL CHECK (verification_status IN ('verified', 'unverified', 'expired', 'suspended', 'disciplinary', 'pending')),
    verification_score NUMERIC(5,2) CHECK (verification_score >= 0 AND verification_score <= 100),
    verification_data JSONB, -- Full response from registry API
    license_number TEXT,
    license_status TEXT,
    issue_date DATE,
    expiration_date DATE,
    jurisdiction TEXT, -- State/country of license
    disciplinary_actions JSONB DEFAULT '[]', -- Array of disciplinary records
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_by TEXT, -- API endpoint or manual reviewer
    expires_at TIMESTAMP WITH TIME ZONE,
    next_check_at TIMESTAMP WITH TIME ZONE,
    check_frequency INTERVAL DEFAULT '30 days',
    confidence_factors JSONB DEFAULT '{}', -- Factors affecting confidence
    external_url TEXT, -- Link to public registry record
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, registry_type, registry_id)
);

CREATE INDEX idx_verification_registry ON verification_results(registry_type, verification_status);
CREATE INDEX idx_verification_profile ON verification_results(profile_id, registry_type);
CREATE INDEX idx_verification_expiry ON verification_results(expiration_date) WHERE expiration_date IS NOT NULL;
CREATE INDEX idx_verification_next_check ON verification_results(next_check_at);
CREATE INDEX idx_verification_score ON verification_results(verification_score DESC);

-- ============================================================================
-- IMMUTABLE AUDIT TRAIL FOR PROFILE EVENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_profile_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('created', 'imported', 'mapped', 'merged', 'published', 'verified', 'updated', 'deleted')),
    actor_id UUID REFERENCES profiles(id), -- Who performed the action
    actor_type TEXT DEFAULT 'user' CHECK (actor_type IN ('user', 'system', 'api', 'scheduler')),
    source_system TEXT, -- Which system/component generated the event
    event_data JSONB NOT NULL, -- Complete event payload
    field_changes JSONB, -- Before/after values for changed fields
    confidence_scores JSONB, -- Confidence scores for each changed field
    validation_results JSONB, -- Validation outcomes
    business_rules_applied TEXT[], -- Which business rules were triggered
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    session_id TEXT, -- User session or batch job ID
    ip_address INET, -- Source IP address
    user_agent TEXT, -- Browser/app information
    correlation_id UUID, -- Link related events together
    sequence_number BIGSERIAL, -- Ordered sequence within correlation
    event_hash TEXT, -- Integrity hash of event data
    previous_event_hash TEXT, -- Chain integrity
    metadata JSONB DEFAULT '{}' -- Additional event metadata
);

-- Prevent updates and deletes to maintain audit integrity
CREATE OR REPLACE RULE audit_profile_events_no_update AS ON UPDATE TO audit_profile_events DO INSTEAD NOTHING;
CREATE OR REPLACE RULE audit_profile_events_no_delete AS ON DELETE TO audit_profile_events DO INSTEAD NOTHING;

CREATE INDEX idx_audit_events_profile ON audit_profile_events(profile_id, event_timestamp DESC);
CREATE INDEX idx_audit_events_type ON audit_profile_events(event_type, event_timestamp DESC);
CREATE INDEX idx_audit_events_actor ON audit_profile_events(actor_id, event_timestamp DESC);
CREATE INDEX idx_audit_events_correlation ON audit_profile_events(correlation_id, sequence_number);
CREATE INDEX idx_audit_events_timestamp ON audit_profile_events(event_timestamp DESC);

-- ============================================================================
-- SPECIALIZED TABLES FOR ENTITY RESOLUTION
-- ============================================================================

-- Similarity calculation cache for performance
CREATE TABLE IF NOT EXISTS similarity_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    profile_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    algorithm_version TEXT NOT NULL,
    similarity_metrics JSONB NOT NULL, -- Detailed similarity breakdown
    calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    UNIQUE(profile_1_id, profile_2_id, algorithm_version),
    CHECK (profile_1_id != profile_2_id)
);

CREATE INDEX idx_similarity_cache_profiles ON similarity_cache(profile_1_id, profile_2_id);
CREATE INDEX idx_similarity_cache_valid ON similarity_cache(valid_until) WHERE valid_until > NOW();

-- Professional taxonomy normalization
CREATE TABLE IF NOT EXISTS taxonomy_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_term TEXT NOT NULL,
    normalized_term TEXT NOT NULL,
    source_system TEXT NOT NULL,
    confidence NUMERIC(5,2) DEFAULT 1.0,
    category TEXT, -- 'specialty', 'certification', 'title', 'industry'
    synonyms TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_term, source_system)
);

CREATE INDEX idx_taxonomy_source ON taxonomy_mappings(source_system, source_term);
CREATE INDEX idx_taxonomy_normalized ON taxonomy_mappings(normalized_term);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profile_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_merge_graph ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_publish_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_profile_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE similarity_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxonomy_mappings ENABLE ROW LEVEL SECURITY;

-- Users can access their own profile data
CREATE POLICY "Users access own profile sources" ON profile_sources 
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users access own change requests" ON change_requests 
    FOR ALL USING (target_profile_id = auth.uid());

CREATE POLICY "Users access own consents" ON privacy_consents 
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users access own publish queue" ON directory_publish_queue 
    FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Users access own verification" ON verification_results 
    FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Users access own audit events" ON audit_profile_events 
    FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Users access own similarity cache" ON similarity_cache 
    FOR SELECT USING (profile_1_id = auth.uid() OR profile_2_id = auth.uid());

-- Admins can manage field mapping rules
CREATE POLICY "Admins manage field mapping" ON field_mapping 
    FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator']));

CREATE POLICY "Admins manage taxonomy" ON taxonomy_mappings 
    FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- Reviewers can access merge graph within their tenant
CREATE POLICY "Reviewers access merge graph" ON profile_merge_graph 
    FOR ALL USING (
        has_any_role(ARRAY['admin', 'reviewer', 'system_administrator']) AND
        (profile_1_id IN (SELECT id FROM profiles WHERE tenant_id = get_current_user_tenant_id()) OR
         profile_2_id IN (SELECT id FROM profiles WHERE tenant_id = get_current_user_tenant_id()))
    );

-- Service role for background jobs
CREATE POLICY "Service role full access" ON profile_sources 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role field mapping" ON field_mapping 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role merge graph" ON profile_merge_graph 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role change requests" ON change_requests 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role publish queue" ON directory_publish_queue 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role verification" ON verification_results 
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_profile_sources_updated_at BEFORE UPDATE ON profile_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_field_mapping_updated_at BEFORE UPDATE ON field_mapping
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merge_graph_updated_at BEFORE UPDATE ON profile_merge_graph
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_privacy_consents_updated_at BEFORE UPDATE ON privacy_consents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_publish_queue_updated_at BEFORE UPDATE ON directory_publish_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_results_updated_at BEFORE UPDATE ON verification_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit event creation trigger
CREATE OR REPLACE FUNCTION create_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_profile_events (
        profile_id,
        event_type,
        actor_id,
        actor_type,
        source_system,
        event_data,
        field_changes
    ) VALUES (
        COALESCE(NEW.profile_id, NEW.user_id, NEW.target_profile_id),
        CASE TG_OP
            WHEN 'INSERT' THEN 'created'
            WHEN 'UPDATE' THEN 'updated'
            WHEN 'DELETE' THEN 'deleted'
        END,
        auth.uid(),
        'user',
        TG_TABLE_NAME,
        row_to_json(COALESCE(NEW, OLD)),
        CASE WHEN TG_OP = 'UPDATE' THEN 
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
        ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply audit triggers to key tables
CREATE TRIGGER audit_profile_sources AFTER INSERT OR UPDATE OR DELETE ON profile_sources
    FOR EACH ROW EXECUTE FUNCTION create_audit_event();

CREATE TRIGGER audit_change_requests AFTER INSERT OR UPDATE OR DELETE ON change_requests
    FOR EACH ROW EXECUTE FUNCTION create_audit_event();

CREATE TRIGGER audit_merge_graph AFTER INSERT OR UPDATE OR DELETE ON profile_merge_graph
    FOR EACH ROW EXECUTE FUNCTION create_audit_event();

-- ============================================================================
-- EXAMPLE DATA AND COMMENTS
-- ============================================================================

-- Sample field mapping rules
COMMENT ON TABLE field_mapping IS 'Defines transformation rules for mapping fields from external sources to internal profile schema';

-- Sample privacy consent record
COMMENT ON TABLE privacy_consents IS 'Granular consent management for GDPR compliance with field-level permissions';

-- Sample verification result
COMMENT ON TABLE verification_results IS 'Professional registry verification results with confidence scoring and monitoring';

-- Sample audit event
COMMENT ON TABLE audit_profile_events IS 'Immutable audit trail for all profile-related operations with integrity protection';

-- Performance and maintenance notes
COMMENT ON INDEX idx_audit_events_timestamp IS 'Primary index for audit log queries - consider partitioning for high volume';
COMMENT ON INDEX idx_verification_next_check IS 'Used by scheduler for automated re-verification jobs';
COMMENT ON INDEX idx_publish_queue_status IS 'Critical for publishing job processing - monitor for queue buildup';