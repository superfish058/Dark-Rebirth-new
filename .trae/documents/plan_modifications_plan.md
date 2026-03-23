# 计划项目样式和功能修改 - 实现计划

## [x] Task 1: 调整计划项目的四周间距
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 减小计划项目（.plan-item）的内边距和外边距
  - 确保整体布局更加紧凑
- **Success Criteria**:
  - 计划项目的间距减小，整体布局更加紧凑
  - 保持良好的视觉效果
- **Test Requirements**:
  - `human-judgement` TR-1.1: 计划项目之间的间距明显减小
  - `human-judgement` TR-1.2: 整体布局仍然美观，不显得拥挤

## [x] Task 2: 完成后隐藏编辑删除按钮
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 当计划项标记为完成时，隐藏编辑和删除按钮
  - 只保留完成状态的显示
- **Success Criteria**:
  - 未完成的计划项显示编辑和删除按钮
  - 已完成的计划项隐藏编辑和删除按钮
- **Test Requirements**:
  - `human-judgement` TR-2.1: 未完成计划项显示编辑和删除按钮
  - `human-judgement` TR-2.2: 已完成计划项隐藏编辑和删除按钮

## [x] Task 3: 添加计划项序号
- **Priority**: P1
- **Depends On**: None
- **Description**:
  - 为每个计划项添加序号
  - 序号从1开始递增
  - 序号样式符合整体设计风格
- **Success Criteria**:
  - 每个计划项都有唯一的序号
  - 序号样式美观，符合整体设计风格
- **Test Requirements**:
  - `human-judgement` TR-3.1: 每个计划项都有序号
  - `human-judgement` TR-3.2: 序号样式符合整体设计风格

## [x] Task 4: 修改完成状态的标识方式
- **Priority**: P1
- **Depends On**: None
- **Description**:
  - 移除完成状态的划线效果
  - 使用其他方式标识完成状态，如背景色变化、图标等
- **Success Criteria**:
  - 已完成的计划项不再显示划线
  - 有其他清晰的标识方式表示完成状态
- **Test Requirements**:
  - `human-judgement` TR-4.1: 已完成计划项没有划线效果
  - `human-judgement` TR-4.2: 完成状态有清晰的标识
