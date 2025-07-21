# Branch Protection Rules Configuration

## Required Setup in GitHub Repository Settings

To enforce security requirements and prevent merging vulnerable code, configure these branch protection rules:

### 1. Main Branch Protection (`main`)

**Path**: Settings → Branches → Add Rule

**Branch name pattern**: `main`

**Required settings**:
- ✅ **Require a pull request before merging**
  - Required approvals: 1 (increase to 2+ for production systems)
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - **Required status checks** (must all pass):
    - `Security Gate - Block PR if vulnerabilities found`
    - `Secret Scanning`
    - `CVE & Dependency Vulnerability Scan`
    - `build` (if you have a build check)
    - `test` (if you have tests)

- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits** (recommended for high security)
- ✅ **Require linear history**
- ✅ **Include administrators** (enforce rules on admins too)
- ✅ **Allow force pushes**: DISABLED
- ✅ **Allow deletions**: DISABLED

### 2. Develop Branch Protection (`develop`) - If using GitFlow

**Branch name pattern**: `develop`

**Required settings**:
- ✅ **Require a pull request before merging**
  - Required approvals: 1
  - ✅ Dismiss stale PR approvals when new commits are pushed

- ✅ **Require status checks to pass before merging**
  - **Required status checks**:
    - `Security Gate - Block PR if vulnerabilities found`
    - `Secret Scanning`
    - `CVE & Dependency Vulnerability Scan`

### 3. Security Branch Rules

**Branch name pattern**: `*security*` (for emergency patches)

**Required settings**:
- ✅ **Require status checks to pass before merging**
  - **Required status checks**:
    - `Security Gate - Block PR if vulnerabilities found`

- ✅ **Allow force pushes**: ENABLED (for emergency security fixes)
- ⚠️ **Bypass pull request requirements for security patches**: Consider enabling for critical emergencies

## Additional Repository Security Settings

### Security & Analysis (Settings → Security & analysis)
- ✅ **Private vulnerability reporting**: Enabled
- ✅ **Dependency graph**: Enabled  
- ✅ **Dependabot alerts**: Enabled
- ✅ **Dependabot security updates**: Enabled
- ✅ **Secret scanning**: Enabled
- ✅ **Push protection**: Enabled (prevents commits with secrets)

### Actions Permissions (Settings → Actions → General)
- **Actions permissions**: Allow select actions and reusable workflows
- **Required workflows**: Enable the security workflows as required
- ✅ **Allow GitHub Actions to create and approve pull requests**: Enabled (for Dependabot)

## Webhook Setup (Optional but Recommended)

Set up webhooks to notify security team of:
- Failed security checks
- Critical vulnerability detection
- Emergency patch deployment
- Blocked merges due to security issues

## Team Access Control

### Security Team Permissions
- **Role**: Maintain or Admin
- **Can**: 
  - Override security blocks in genuine emergencies
  - Access security scanning results
  - Approve emergency patch PRs
  - Deploy emergency fixes

### Developer Permissions  
- **Role**: Write
- **Cannot**:
  - Bypass security checks
  - Merge PRs with security failures
  - Disable security workflows
  - Override branch protection rules

## Testing Branch Protection

1. Create a test PR with a fake secret (e.g., `sk-test123456789012345678901234567890123456789`)
2. Verify the PR is blocked by secret scanning
3. Create a test PR with a vulnerable dependency
4. Verify the PR is blocked by vulnerability scanning
5. Test that PRs cannot be merged until all security checks pass

## Emergency Override Process

For genuine security emergencies (e.g., active exploitation):

1. Security team member can temporarily disable branch protection
2. Apply emergency patch directly to main branch
3. Re-enable branch protection immediately
4. Create post-incident PR with proper review
5. Document emergency override in security log

**Note**: All emergency overrides must be logged and reviewed in the next security meeting.

## Monitoring & Alerts

Set up alerts for:
- Branch protection rule changes
- Security check failures
- Emergency overrides
- Dependabot alert increases
- Failed deployments due to security issues

This configuration ensures that no code with security vulnerabilities or exposed secrets can be merged to main branches, enforcing the 24-hour patch SLA and maintaining security standards.