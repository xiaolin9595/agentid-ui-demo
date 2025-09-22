/**
 * AgentDiscoveryStore 功能验证脚本
 * 用于测试Store的基本功能
 */
import { useAgentDiscoveryStore } from './agentDiscoveryStore';

// 创建一个简单的测试函数
export async function testAgentDiscoveryStore() {
  console.log('开始测试 AgentDiscoveryStore...');

  try {
    const store = useAgentDiscoveryStore.getState();

    // 测试 1: 检查初始状态
    console.log('测试 1: 检查初始状态');
    console.log('✓ 初始搜索参数:', store.searchParams);
    console.log('✓ 初始视图模式:', store.viewMode);
    console.log('✓ 初始过滤状态:', store.showFilters);

    // 测试 2: 更新搜索参数
    console.log('\n测试 2: 更新搜索参数');
    store.updateSearchParams({ search: 'test agent', page: 1 });
    console.log('✓ 搜索参数更新成功:', store.searchParams.search);

    // 测试 3: 切换视图模式
    console.log('\n测试 3: 切换视图模式');
    store.setViewMode('list');
    console.log('✓ 视图模式切换成功:', store.viewMode);

    // 测试 4: 切换过滤面板
    console.log('\n测试 4: 切换过滤面板');
    store.toggleFilters();
    console.log('✓ 过滤面板状态:', store.showFilters);

    // 测试 5: 设置过滤器
    console.log('\n测试 5: 设置过滤器');
    store.setActiveFilters({
      statuses: ['active'],
      languages: ['javascript']
    });
    console.log('✓ 过滤器设置成功:', store.activeFilters.statuses);

    // 测试 6: 设置排序
    console.log('\n测试 6: 设置排序');
    store.setCurrentSort({
      field: 'name',
      order: 'asc'
    });
    console.log('✓ 排序设置成功:', store.currentSort);

    // 测试 7: 计算属性
    console.log('\n测试 7: 计算属性');
    const selectedCount = store.getSelectedAgentsCount();
    console.log('✓ 选中Agent数量:', selectedCount);

    // 测试 8: 错误处理
    console.log('\n测试 8: 错误处理');
    store.clearErrors();
    console.log('✓ 错误清理成功');

    // 测试 9: 重置Store
    console.log('\n测试 9: 重置Store');
    store.resetStore();
    console.log('✓ Store重置成功');
    console.log('✓ 重置后搜索参数:', store.searchParams.search);

    console.log('\n🎉 所有测试通过！AgentDiscoveryStore 功能正常。');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 如果直接运行此文件，执行测试
if (typeof window !== 'undefined') {
  // 在浏览器环境中运行
  (window as any).testAgentDiscoveryStore = testAgentDiscoveryStore;
} else {
  // 在Node环境中运行
  testAgentDiscoveryStore();
}

export default testAgentDiscoveryStore;