package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Entities.Task;
import com.jyh000223.mega_project.Entities.TaskList;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Repository.TaskListRepository;
import com.jyh000223.mega_project.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskListService {
    private final TaskListRepository taskListRepository;
    private final ProjectRepository projectRepository;
    @Autowired
    private TaskRepository taskRepository;

    public TaskListService(TaskListRepository taskListRepository, ProjectRepository projectRepository) {
        this.taskListRepository = taskListRepository;
        this.projectRepository = projectRepository;

    }

    /** ✅ 프로젝트 ID로 TaskList 조회 */
    public List<TaskList> getTaskListsByProjectId(int projectId) {
        return taskListRepository.findByProject_ProjectId(projectId);
    }

    public TaskList createTaskList(TaskList taskList) {
        if (taskList.getProject() == null || taskList.getProject().getProjectId() == 0) {
            throw new RuntimeException("프로젝트 ID가 필요합니다.");
        }

        Project project = projectRepository.findById(taskList.getProject().getProjectId())
                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));

        taskList.setProject(project);
        return taskListRepository.save(taskList);
    }
    /** ✅ 프로젝트 ID와 TaskList ID로 Task 조회 */
    public List<Task> getTasksByProjectAndTasklist(int projectId, int tasklistId) {
        return taskRepository.findByProject_ProjectIdAndTaskList_TasklistId(projectId, tasklistId);
    }

    public Optional<TaskList> getTaskListById(int tasklistId) {
        return taskListRepository.findById(tasklistId);
    }

    public void deleteTaskList(TaskList taskList) {
        taskListRepository.delete(taskList);
    }


}
