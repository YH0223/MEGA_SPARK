package com.jyh000223.mega_project.Service;

import com.jyh000223.mega_project.DTO.TaskDTO;
import com.jyh000223.mega_project.Entities.Project;
import com.jyh000223.mega_project.Entities.Task;
import com.jyh000223.mega_project.Repository.ProjectRepository;
import com.jyh000223.mega_project.Repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public List<Task> getTasksByProjectId(int projectId) {
        return taskRepository.findByProject_ProjectId(projectId);
    }

    public Task createTask(TaskDTO taskDTO) {
        Optional<Project> projectOpt = projectRepository.findById(taskDTO.getProject_id());

        if (projectOpt.isEmpty()) {
            throw new IllegalArgumentException("Project ID가 유효하지 않습니다.");
        }

        Task task = new Task();
        task.setTaskName(taskDTO.getTask_name());
        task.setChecking(taskDTO.isChecking());
        task.setProject(projectOpt.get());

        return taskRepository.save(task);
    }

    public void deleteTask(int taskId) {
        taskRepository.deleteById(taskId);
    }

    public void toggleTaskChecking(int taskId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);

        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setChecking(!task.isChecking());
            taskRepository.save(task);
        }
    }
    /** ✅ 프로젝트별 Task 개수 세기 */
    public int countTasksByProjectId(int projectId) {
        return taskRepository.countByProject_ProjectId(projectId);
    }
}
