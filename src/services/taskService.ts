import {
  Task,
  TaskTemplate,
  TaskExecution,
  TaskQueryParams,
  TaskListResponse,
  TaskStatistics,
  TaskMonitorStatus,
  TaskExecutionRequest,
  TaskLog,
  TaskResult,
  TaskFilter,
  TaskPagination,
  TaskStatus,
  TaskPriority,
  TaskType,
  TaskParameterType
} from '../types/task';

// 模拟API响应延迟
const API_DELAY = 300;

// 模拟API响应包装器
const mockApiCall = <T>(data: T, delay: number = API_DELAY): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// 模拟API错误
const mockApiError = (message: string, delay: number = API_DELAY): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};

// 模拟任务数据存储
let mockTasks: Task[] = [];
let mockTaskTemplates: TaskTemplate[] = [];

export class TaskService {
  /**
   * 获取任务列表
   */
  static async getTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
    await mockApiCall(null, 200);

    let filteredTasks = [...mockTasks];

    // 应用过滤
    if (params?.filter) {
      const { status, type, priority, agentId, dateRange, tags, search } = params.filter;

      if (status && status.length > 0) {
        filteredTasks = filteredTasks.filter(task => status.includes(task.status));
      }

      if (type && type.length > 0) {
        filteredTasks = filteredTasks.filter(task => type.includes(task.type));
      }

      if (priority && priority.length > 0) {
        filteredTasks = filteredTasks.filter(task => priority.includes(task.priority));
      }

      if (agentId && agentId.length > 0) {
        filteredTasks = filteredTasks.filter(task => agentId.includes(task.agentId));
      }

      if (dateRange) {
        filteredTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate >= dateRange.start && taskDate <= dateRange.end;
        });
      }

      if (tags && tags.length > 0) {
        filteredTasks = filteredTasks.filter(task =>
          tags.some(tag => task.tags.includes(tag))
        );
      }

      if (search) {
        filteredTasks = filteredTasks.filter(task =>
          task.name.toLowerCase().includes(search.toLowerCase()) ||
          task.description?.toLowerCase().includes(search.toLowerCase())
        );
      }
    }

    // 应用排序
    if (params?.sort) {
      const { field, order } = params.sort;
      filteredTasks.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (order === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    // 应用分页
    const pagination = params?.pagination || {
      page: 1,
      limit: 20,
      total: filteredTasks.length
    };

    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    // 计算统计
    const summary = {
      total: filteredTasks.length,
      pending: filteredTasks.filter(t => t.status === 'pending').length,
      running: filteredTasks.filter(t => t.status === 'running').length,
      completed: filteredTasks.filter(t => t.status === 'completed').length,
      failed: filteredTasks.filter(t => t.status === 'failed').length,
      cancelled: filteredTasks.filter(t => t.status === 'cancelled').length
    };

    return {
      tasks: paginatedTasks,
      pagination: {
        ...pagination,
        total: filteredTasks.length
      },
      summary
    };
  }

  /**
   * 获取任务模板
   */
  static async getTaskTemplates(): Promise<TaskTemplate[]> {
    await mockApiCall(null, 150);
    return mockTaskTemplates;
  }

  /**
   * 获取任务详情
   */
  static async getTaskById(id: string): Promise<Task> {
    await mockApiCall(null, 100);

    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`任务 ${id} 不存在`);
    }

    return task;
  }

  /**
   * 创建任务
   */
  static async createTask(request: TaskExecutionRequest): Promise<Task> {
    await mockApiCall(null, 500);

    const template = mockTaskTemplates.find(t => t.id === request.templateId);
    if (!template) {
      throw new Error(`任务模板 ${request.templateId} 不存在`);
    }

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      templateId: template.id,
      template,
      name: template.name,
      type: template.type,
      priority: request.priority || TaskPriority.NORMAL,
      status: TaskStatus.PENDING,
      agentId: request.agentId,
      agent: {} as any, // 这里应该从agent store获取
      parameters: request.parameters,
      progress: 0,
      executionTime: 0,
      estimatedDuration: template.estimatedDuration,
      maxRetries: template.maxRetries,
      retryCount: 0,
      timeout: template.timeout,
      tags: request.tags || [],
      dependencies: request.dependencies,
      metadata: request.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockTasks.unshift(newTask);
    return newTask;
  }

  /**
   * 执行任务
   */
  static async executeTask(taskId: string): Promise<TaskExecution> {
    await mockApiCall(null, 200);

    const task = mockTasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`任务 ${taskId} 不存在`);
    }

    const execution: TaskExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      task,
      executionId: `exec_${taskId}`,
      status: TaskStatus.RUNNING,
      agentId: task.agentId,
      startTime: new Date(),
      progress: 0,
      logs: [],
      metrics: {
        executionTime: 0,
        memoryUsed: 0,
        cpuUsage: 0,
        networkCalls: 0,
        dataProcessed: 0
      },
      retries: 0,
      maxRetries: task.maxRetries,
      isTimeout: false
    };

    // 模拟任务执行过程
    this.simulateTaskExecution(taskId, execution.id);

    return execution;
  }

  /**
   * 取消任务
   */
  static async cancelTask(taskId: string): Promise<void> {
    await mockApiCall(null, 100);

    const task = mockTasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`任务 ${taskId} 不存在`);
    }

    if (task.status === 'completed' || task.status === TaskStatus.FAILED || task.status === 'cancelled') {
      throw new Error(`任务 ${taskId} 状态不允许取消`);
    }

    task.status = TaskStatus.CANCELLED;
    task.updatedAt = new Date();
  }

  /**
   * 暂停任务
   */
  static async pauseTask(taskId: string): Promise<void> {
    await mockApiCall(null, 100);

    const task = mockTasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`任务 ${taskId} 不存在`);
    }

    if (task.status !== 'running') {
      throw new Error(`任务 ${taskId} 状态不允许暂停`);
    }

    task.status = TaskStatus.PAUSED;
    task.updatedAt = new Date();
  }

  /**
   * 恢复任务
   */
  static async resumeTask(taskId: string): Promise<void> {
    await mockApiCall(null, 100);

    const task = mockTasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`任务 ${taskId} 不存在`);
    }

    if (task.status !== 'paused') {
      throw new Error(`任务 ${taskId} 状态不允许恢复`);
    }

    task.status = 'running';
    task.updatedAt = new Date();
  }

  /**
   * 重试任务
   */
  static async retryTask(taskId: string): Promise<TaskExecution> {
    await mockApiCall(null, 200);

    const task = mockTasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`任务 ${taskId} 不存在`);
    }

    if (task.status !== 'failed') {
      throw new Error(`任务 ${taskId} 状态不允许重试`);
    }

    if (task.retryCount >= task.maxRetries) {
      throw new Error(`任务 ${taskId} 已达到最大重试次数`);
    }

    task.status = 'running';
    task.retryCount++;
    task.updatedAt = new Date();

    const execution: TaskExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      task,
      executionId: `exec_${taskId}`,
      status: TaskStatus.RUNNING,
      agentId: task.agentId,
      startTime: new Date(),
      progress: 0,
      logs: [],
      metrics: {
        executionTime: 0,
        memoryUsed: 0,
        cpuUsage: 0,
        networkCalls: 0,
        dataProcessed: 0
      },
      retries: task.retryCount,
      maxRetries: task.maxRetries,
      isTimeout: false
    };

    this.simulateTaskExecution(taskId, execution.id);

    return execution;
  }

  /**
   * 删除任务
   */
  static async deleteTask(taskId: string): Promise<void> {
    await mockApiCall(null, 100);

    const taskIndex = mockTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`任务 ${taskId} 不存在`);
    }

    mockTasks.splice(taskIndex, 1);
  }

  /**
   * 批量取消任务
   */
  static async batchCancelTasks(taskIds: string[]): Promise<void> {
    await mockApiCall(null, 300);

    for (const taskId of taskIds) {
      const task = mockTasks.find(t => t.id === taskId);
      if (task && task.status !== 'completed' && task.status !== 'failed' && task.status !== 'cancelled') {
        task.status = TaskStatus.CANCELLED;
        task.updatedAt = new Date();
      }
    }
  }

  /**
   * 批量删除任务
   */
  static async batchDeleteTasks(taskIds: string[]): Promise<void> {
    await mockApiCall(null, 300);

    mockTasks = mockTasks.filter(task => !taskIds.includes(task.id));
  }

  /**
   * 获取任务日志
   */
  static async getTaskLogs(taskId: string): Promise<TaskLog[]> {
    await mockApiCall(null, 150);

    // 模拟日志数据
    const logs: TaskLog[] = [
      {
        id: 'log_1',
        timestamp: new Date(Date.now() - 60000),
        level: 'info',
        message: '任务开始执行',
        source: 'system'
      },
      {
        id: 'log_2',
        timestamp: new Date(Date.now() - 30000),
        level: 'info',
        message: '正在处理数据...',
        source: 'agent'
      }
    ];

    return logs;
  }

  /**
   * 获取任务结果
   */
  static async getTaskResult(taskId: string): Promise<TaskResult> {
    await mockApiCall(null, 200);

    const task = mockTasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`任务 ${taskId} 不存在`);
    }

    if (task.status !== 'completed') {
      throw new Error(`任务 ${taskId} 尚未完成`);
    }

    // 模拟任务结果
    const result: TaskResult = {
      success: true,
      data: {
        processedItems: 100,
        accuracy: 0.95,
        processingTime: 4500
      },
      output: {
        type: 'json',
        content: {
          result: 'success',
          data: '任务执行完成'
        },
        format: 'json'
      },
      summary: '任务成功完成，处理了100个项目',
      metrics: {
        executionTime: 4500,
        memoryUsed: 512,
        cpuUsage: 25,
        networkCalls: 3,
        dataProcessed: 1024
      },
      completedAt: new Date()
    };

    return result;
  }

  /**
   * 获取任务统计
   */
  static async getTaskStatistics(): Promise<TaskStatistics> {
    await mockApiCall(null, 300);

    const stats: TaskStatistics = {
      totalTasks: mockTasks.length,
      completedTasks: mockTasks.filter(t => t.status === 'completed').length,
      failedTasks: mockTasks.filter(t => t.status === 'failed').length,
      runningTasks: mockTasks.filter(t => t.status === 'running').length,
      averageExecutionTime: 4500,
      successRate: 0.85,
      tasksByType: {} as any,
      tasksByStatus: {} as any,
      dailyTaskCount: [
        { date: '2024-01-01', count: 5 },
        { date: '2024-01-02', count: 8 },
        { date: '2024-01-03', count: 12 },
        { date: '2024-01-04', count: 6 },
        { date: '2024-01-05', count: 15 }
      ],
      agentPerformance: [
        {
          agentId: 'agent_1',
          agentName: '数据处理助手',
          totalTasks: 25,
          successRate: 0.92,
          averageExecutionTime: 3800
        },
        {
          agentId: 'agent_2',
          agentName: '内容生成助手',
          totalTasks: 18,
          successRate: 0.78,
          averageExecutionTime: 5200
        }
      ]
    };

    // 计算任务类型统计
    mockTasks.forEach(task => {
      stats.tasksByType[task.type] = (stats.tasksByType[task.type] || 0) + 1;
      stats.tasksByStatus[task.status] = (stats.tasksByStatus[task.status] || 0) + 1;
    });

    return stats;
  }

  /**
   * 获取监控状态
   */
  static async getMonitorStatus(): Promise<TaskMonitorStatus> {
    await mockApiCall(null, 200);

    const status: TaskMonitorStatus = {
      activeTasks: mockTasks.filter(t => t.status === 'running').length,
      queueLength: mockTasks.filter(t => t.status === 'pending').length,
      systemLoad: {
        cpu: 45,
        memory: 68,
        disk: 52
      },
      alerts: [
        {
          id: 'alert_1',
          type: 'warning',
          message: '系统负载较高',
          timestamp: new Date(Date.now() - 300000),
          resolved: false
        }
      ]
    };

    return status;
  }

  /**
   * 模拟任务执行过程
   */
  private static simulateTaskExecution(taskId: string, executionId: string): void {
    const progressInterval = setInterval(() => {
      const task = mockTasks.find(t => t.id === taskId);
      if (!task) {
        clearInterval(progressInterval);
        return;
      }

      if (task.status !== 'running') {
        clearInterval(progressInterval);
        return;
      }

      // 更新进度
      const progressIncrement = Math.random() * 15;
      task.progress = Math.min(100, task.progress + progressIncrement);
      task.executionTime += 1000;
      task.updatedAt = new Date();

      // 模拟完成或失败
      if (task.progress >= 100) {
        // 85% 概率成功
        if (Math.random() < 0.85) {
          task.status = 'completed';
          task.completedAt = new Date();
        } else {
          task.status = 'failed';
          task.error = '任务执行失败';
          task.completedAt = new Date();
        }
        clearInterval(progressInterval);
      }
    }, 1000);
  }

  /**
   * 初始化模拟数据
   */
  static initializeMockData(): void {
    // 初始化任务模板
    mockTaskTemplates = [
      {
        id: 'template_1',
        name: '数据分析任务',
        description: '对提供的数据进行分析和处理',
        type: 'data_processing',
        category: '数据处理',
        version: '1.0.0',
        agentTypes: ['AI Assistant', 'Data Processing'],
        parameters: [
          {
            id: 'data_source',
            name: '数据源',
            type: 'string',
            description: '数据源路径或URL',
            required: true,
            ui: { component: 'input', placeholder: '请输入数据源' }
          },
          {
            id: 'analysis_type',
            name: '分析类型',
            type: 'string',
            description: '选择分析类型',
            required: true,
            ui: {
              component: 'select',
              options: [
                { label: '统计分析', value: 'statistical' },
                { label: '趋势分析', value: 'trend' },
                { label: '预测分析', value: 'prediction' }
              ]
            }
          }
        ],
        expectedOutput: {
          type: 'analysis_report',
          description: '分析结果报告'
        },
        estimatedDuration: 300,
        maxRetries: 3,
        timeout: 600,
        tags: ['数据分析', '处理'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      }
    ];

    // 初始化一些示例任务
    mockTasks = [
      {
        id: 'task_1',
        templateId: 'template_1',
        template: mockTaskTemplates[0],
        name: '用户行为分析',
        type: 'data_processing',
        priority: 'normal',
        status: TaskStatus.COMPLETED,
        agentId: 'agent_1',
        agent: {} as any,
        parameters: {
          data_source: '/data/user_behavior.csv',
          analysis_type: 'statistical'
        },
        progress: 100,
        executionTime: 4500,
        estimatedDuration: 300,
        maxRetries: 3,
        retryCount: 0,
        timeout: 600,
        startedAt: new Date(Date.now() - 10000),
        completedAt: new Date(Date.now() - 5500),
        createdAt: new Date(Date.now() - 15000),
        updatedAt: new Date(Date.now() - 5500),
        tags: ['分析', '用户行为']
      },
      {
        id: 'task_2',
        templateId: 'template_1',
        template: mockTaskTemplates[0],
        name: '销售数据预测',
        type: 'data_processing',
        priority: 'high',
        status: TaskStatus.RUNNING,
        agentId: 'agent_2',
        agent: {} as any,
        parameters: {
          data_source: '/data/sales.csv',
          analysis_type: 'prediction'
        },
        progress: 65,
        executionTime: 1800,
        estimatedDuration: 300,
        maxRetries: 3,
        retryCount: 0,
        timeout: 600,
        startedAt: new Date(Date.now() - 3000),
        createdAt: new Date(Date.now() - 5000),
        updatedAt: new Date(Date.now() - 1000),
        tags: ['预测', '销售']
      }
    ];
  }
}

// 初始化模拟数据
TaskService.initializeMockData();