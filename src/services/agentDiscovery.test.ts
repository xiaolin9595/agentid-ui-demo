import { agentDiscoveryService } from './index';
import type {
  AgentDiscoverySearchParams,
  AgentDiscoverySortParams,
  AgentDiscoveryFilterParams
} from '../types/agent-discovery';

/**
 * Agent发现服务测试
 * 简单的功能测试，验证服务是否正常工作
 */

// 测试辅助函数
function expect(condition: boolean, message?: string): void {
  if (!condition) {
    throw new Error(message || 'Expectation failed');
  }
}

function assertEquals(actual: any, expected: any, message?: string): void {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertDefined(value: any, message?: string): void {
  if (value === undefined || value === null) {
    throw new Error(message || 'Value is undefined or null');
  }
}

function assertArray(value: any, message?: string): void {
  if (!Array.isArray(value)) {
    throw new Error(message || 'Value is not an array');
  }
}

function assertContains(array: any[], item: any, message?: string): void {
  if (!array.includes(item)) {
    throw new Error(message || `Array does not contain ${item}`);
  }
}

// 导出测试运行函数
export async function runAgentDiscoveryTests() {
  console.log('开始运行Agent发现服务测试...\n');

  const tests = [
    { name: '搜索功能测试', test: () => agentDiscoveryService.searchAgents({ search: 'AI', page: 1, pageSize: 5 }, { field: 'name', order: 'asc' }, {}) },
    { name: 'Agent详情测试', test: () => agentDiscoveryService.getAgentDetails('1') },
    { name: '通信状态测试', test: () => agentDiscoveryService.getCommunicationStatus('1') },
    { name: '统计信息测试', test: () => agentDiscoveryService.getStatistics() }
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of tests) {
    try {
      console.log(`运行测试: ${testCase.name}`);
      await testCase.test();
      console.log(`✅ ${testCase.name} 通过\n`);
      passed++;
    } catch (error) {
      console.log(`❌ ${testCase.name} 失败: ${error}\n`);
      failed++;
    }
  }

  console.log(`测试结果: ${passed} 通过, ${failed} 失败`);

  if (failed === 0) {
    console.log('🎉 所有测试通过！');
  } else {
    console.log('⚠️  有测试失败，请检查代码');
  }

  return { passed, failed };
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  runAgentDiscoveryTests().catch(console.error);
}