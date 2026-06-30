import { useState } from 'react';
import { Music, Plus, ChevronDown, MoreHorizontal, Trash2, Settings, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pencil } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { CreateBoardModal } from '@/components/modals/CreateBoardModal';
import { SettingsModal } from '@/components/modals/SettingsModal';

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [createBoardProjectId, setCreateBoardProjectId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    projects,
    boards,
    selectedProjectId,
    selectedBoardId,
    selectProject,
    selectBoard,
  } = useAppStore();

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => ({ ...prev, [projectId]: !(prev[projectId] ?? true) }));
  };

  const isProjectExpanded = (projectId: string) => expandedProjects[projectId] ?? true;

  const allExpanded = projects.length > 0 && projects.every((p) => isProjectExpanded(p.id));
  const toggleAllProjects = () => {
    const next = !allExpanded;
    setExpandedProjects(Object.fromEntries(projects.map((p) => [p.id, next])));
  };

  return (
    <>
      <Sidebar className="border-r border-border">
        <SidebarHeader className="h-14 flex-row items-center px-4 py-0 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary shrink-0">
              <Music className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <h1 className="text-sm font-semibold text-foreground">Music Notes</h1>
                <p className="text-xs text-muted-foreground">Creative notebook</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <Collapsible open={projectsOpen} onOpenChange={setProjectsOpen}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-accent rounded-md px-2 py-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Projects
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      title={allExpanded ? 'Collapse all' : 'Expand all'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllProjects();
                      }}
                    >
                      {allExpanded ? (
                        <ChevronsDownUp className="h-3 w-3" />
                      ) : (
                        <ChevronsUpDown className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCreateProjectOpen(true);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {projects.map((project) => {
                      const isActive = selectedProjectId === project.id;
                      const projectBoards = boards.filter((b) => b.projectId === project.id);
                      const expanded = isProjectExpanded(project.id);
                      return (
                        <div key={project.id}>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              onClick={() => {
                                selectProject(project.id);
                                toggleProject(project.id);
                                const firstBoard = projectBoards[0];
                                if (firstBoard) selectBoard(firstBoard.id);
                              }}
                              className={cn('w-full', isActive && 'bg-accent text-accent-foreground')}
                            >
                              <ChevronDown
                                className={cn(
                                  'h-3 w-3 shrink-0 transition-transform text-muted-foreground',
                                  expanded ? '' : '-rotate-90'
                                )}
                              />
                              {!collapsed && <span className="flex-1 truncate">{project.name}</span>}
                              {!collapsed && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 ml-auto opacity-0 group-hover/menu-item:opacity-100"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const next = window.prompt('Rename project', project.name);
                                        if (next && next.trim() && next !== project.name) {
                                          const { projects, setProjects } = useAppStore.getState();
                                          setProjects(
                                            projects.map((p) =>
                                              p.id === project.id ? { ...p, name: next.trim() } : p
                                            )
                                          );
                                        }
                                      }}
                                    >
                                      <Pencil className="h-3.5 w-3.5 mr-2" />
                                      Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        selectProject(project.id);
                                        setCreateBoardProjectId(project.id);
                                        setCreateBoardOpen(true);
                                      }}
                                    >
                                      <Plus className="h-3.5 w-3.5 mr-2" />
                                      New board
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        selectProject(project.id);
                                        setSettingsOpen(true);
                                      }}
                                    >
                                      <Settings className="h-3.5 w-3.5 mr-2" />
                                      Project settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        useAppStore.getState().deleteProject(project.id);
                                      }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                                      Delete project
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </SidebarMenuButton>
                          </SidebarMenuItem>

                          {expanded && !collapsed && (
                            <div className="ml-6 border-l border-border/60 pl-1 mt-0.5 mb-1">
                              {projectBoards.length === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    selectProject(project.id);
                                    setCreateBoardProjectId(project.id);
                                    setCreateBoardOpen(true);
                                  }}
                                  className="flex items-center gap-2 w-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>New board</span>
                                </button>
                              ) : (
                                projectBoards.map((board) => {
                                  const isBoardActive = selectedBoardId === board.id;
                                  return (
                                    <SidebarMenuItem key={board.id}>
                                      <SidebarMenuButton
                                        onClick={() => {
                                          selectProject(project.id);
                                          selectBoard(board.id);
                                        }}
                                        className={cn(
                                          'w-full h-8 text-sm',
                                          isBoardActive && 'bg-accent text-accent-foreground'
                                        )}
                                      >
                                        <span className="truncate">{board.name}</span>
                                      </SidebarMenuButton>
                                    </SidebarMenuItem>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>
      </Sidebar>

      <CreateProjectModal open={createProjectOpen} onOpenChange={setCreateProjectOpen} />
      <CreateBoardModal
        open={createBoardOpen}
        onOpenChange={(open) => {
          setCreateBoardOpen(open);
          if (!open) setCreateBoardProjectId(null);
        }}
        projectId={createBoardProjectId ?? undefined}
      />
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
