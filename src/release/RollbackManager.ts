export interface RollbackPlan {
  previous_tag: string;
  flags_to_flip: Array<{ flag: string; revert_to: boolean }>;
  route_aliases: Array<{ from: string; to: string }>;
  timestamp: string;
  rollback_procedure: string[];
}

export class RollbackManager {
  
  async createRollbackPlan(): Promise<RollbackPlan> {
    console.log('📋 Creating rollback plan...');

    const previousTag = this.getPreviousTag();
    const flagsToFlip = this.identifyFlagsToRevert();
    const routeAliases = this.getRouteAliases();

    const rollbackPlan: RollbackPlan = {
      previous_tag: previousTag,
      flags_to_flip: flagsToFlip,
      route_aliases: routeAliases,
      timestamp: new Date().toISOString(),
      rollback_procedure: [
        '1. Set IA_V2=false to revert navigation',
        '2. Flip feature flags to previous state',
        '3. Activate route aliases for compatibility',
        '4. Monitor system stability',
        '5. Validate critical user flows',
        '6. Update status page if needed'
      ]
    };

    await this.writeRollbackPlan(rollbackPlan);
    return rollbackPlan;
  }

  async executeRollback(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Executing rollback...');

      const rollbackPlan = await this.loadRollbackPlan();
      if (!rollbackPlan) {
        throw new Error('No rollback plan found');
      }

      // Revert feature flags
      for (const flag of rollbackPlan.flags_to_flip) {
        localStorage.setItem(`flag_${flag.flag}`, flag.revert_to.toString());
        console.log(`Reverted flag ${flag.flag} to ${flag.revert_to}`);
      }

      // Activate route aliases
      localStorage.setItem('rollback_routes_active', 'true');
      console.log('Activated rollback route aliases');

      // Log rollback execution
      const rollbackRecord = {
        executed_at: new Date().toISOString(),
        plan_timestamp: rollbackPlan.timestamp,
        success: true
      };
      localStorage.setItem('rollback_execution', JSON.stringify(rollbackRecord));

      return { success: true, message: 'Rollback executed successfully' };
    } catch (error) {
      console.error('Rollback execution failed:', error);
      return { success: false, message: `Rollback failed: ${error}` };
    }
  }

  private getPreviousTag(): string {
    // In real implementation, would get from version control or deployment history
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return `RC-${yesterday.getFullYear()}.${String(yesterday.getMonth() + 1).padStart(2, '0')}.${String(yesterday.getDate()).padStart(2, '0')}`;
  }

  private identifyFlagsToRevert(): Array<{ flag: string; revert_to: boolean }> {
    return [
      { flag: 'IA_V2', revert_to: false },
      { flag: 'DEMO_MODE', revert_to: false },
      { flag: 'PUBLISH_BATCH', revert_to: false },
      { flag: 'families_tools_band', revert_to: false },
      { flag: 'pricing_gates', revert_to: false }
    ];
  }

  private getRouteAliases(): Array<{ from: string; to: string }> {
    return [
      { from: '/families-hub', to: '/families' },
      { from: '/service-pros', to: '/advisors' },
      { from: '/new-nav/*', to: '/old-nav/*' }
    ];
  }

  private async writeRollbackPlan(plan: RollbackPlan): Promise<void> {
    try {
      const content = JSON.stringify(plan, null, 2);
      console.log('Writing /out/release/Rollback.json');
      localStorage.setItem('rollback_plan', content);
    } catch (error) {
      console.error('Failed to write rollback plan:', error);
      throw error;
    }
  }

  private async loadRollbackPlan(): Promise<RollbackPlan | null> {
    try {
      const content = localStorage.getItem('rollback_plan');
      return content ? JSON.parse(content) : null;
    } catch {
      return null;
    }
  }
}