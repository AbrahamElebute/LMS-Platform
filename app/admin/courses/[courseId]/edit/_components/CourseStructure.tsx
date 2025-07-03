"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useEffect, useState } from "react";
import SortableItem from "./SortableItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminGetCourseType } from "@/app/data/admin/admin-get-course";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVerticalIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../actions";

interface iAppProps {
  data: AdminGetCourseType;
}

const CourseStructure = ({ data }: iAppProps) => {
  const initialItems =
    data.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems((prev) => {
      const updateItem =
        data.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          isOpen: prev.find((item) => item.id === chapter.id)?.isOpen ?? true,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];
      return updateItem;
    });
  }, [data]);

  function toggleChapter(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;

    if (activeType === "chapter") {
      let targetChapterId = null;

      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        toast.error("Could not detemine chapter");
        return;
      }

      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Could not detemine chapter index");

        return;
      }

      const reorderLocalChapter = arrayMove(items, oldIndex, newIndex);
      const updatedChapterForState = reorderLocalChapter.map(
        (chapter, index) => ({
          ...chapter,
          order: index + 1,
        })
      );

      const pervItems = [...items];

      setItems(updatedChapterForState);

      if (courseId) {
        const chapterToUpdate = updatedChapterForState.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));

        const reoderPromise = () => reorderChapters(chapterToUpdate, courseId);

        toast.promise(reoderPromise(), {
          loading: "Reordering Chapters...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(pervItems);
            return "Failed to reorder chapters";
          },
        });
      }
      return;
    }
    if (activeType === "lesson" && overType === "lesson") {
      let chapterId = active.data.current?.chapterId;
      let overChapterId = over.data.current?.chapterId;

      if (!chapterId || chapterId !== overChapterId) {
        toast.error(
          "Moving lessons between different chapters or to an invalid chapter is not allowed."
        );
        return;
      }
      const chapterIndex = items.findIndex(
        (chapter) => chapter.id === chapterId
      );

      if (chapterIndex === -1) {
        toast.error("Could not find chapter for lesson");
        return;
      }

      const chapterToUpdate = items[chapterIndex];

      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lessons) => lessons.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lessons) => lessons.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Could not detemine Lesson");

        return;
      }

      const reorderLocalLesson = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );

      const updatedLessonForState = reorderLocalLesson.map((lesson, index) => ({
        ...lesson,
        order: String(index + 1),
      }));

      const newItems = [...items];

      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonForState,
      };

      const pervItems = [...items];

      setItems(newItems);

      if (courseId) {
        const lessonToUpdate = updatedLessonForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));

        const reoderLessonPromise = () =>
          reorderLessons(chapterId, lessonToUpdate, courseId);

        toast.promise(reoderLessonPromise(), {
          loading: "Reordering Lessons...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(pervItems);
            return "Failed to reorder lessons";
          },
        });
      }

      return;
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <div className="">
                    <Card>
                      <Collapsible
                        open={item.isOpen}
                        onOpenChange={() => {
                          toggleChapter(item.id);
                        }}
                      >
                        <div className="flex items-center p-3 justify-between gap-3 border-b border-border">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="cursor-move"
                              {...listeners}
                            >
                              <GripVerticalIcon className="size-4" />
                            </Button>
                            <CollapsibleTrigger asChild>
                              <Button size="icon" variant="ghost">
                                {item.isOpen ? (
                                  <ChevronDown className="size-4" />
                                ) : (
                                  <ChevronRight className="size-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>

                            <p className="cursor-pointer hover:text-primary ml-2">
                              {item.title}
                            </p>
                          </div>

                          <Button size="icon" variant="outline">
                            <Trash2 size="4" />
                          </Button>
                        </div>

                        <CollapsibleContent>
                          <div className="p-1">
                            <SortableContext
                              items={item.lessons.map((lesson) => lesson.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              {item.lessons.map((lesson) => (
                                <SortableItem
                                  key={lesson.id}
                                  id={lesson.id}
                                  data={{ type: "lesson", chapterId: item.id }}
                                >
                                  {(lessonListeners) => (
                                    <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="cursor-move"
                                          {...lessonListeners}
                                        >
                                          <GripVerticalIcon className="size-4" />
                                        </Button>
                                        <FileText className="size-4" />
                                        <Link
                                          href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                          className="cursor-pointer hover:text-primary ml-2"
                                        >
                                          {lesson.title}
                                        </Link>
                                      </div>
                                      <Button size="icon" variant="outline">
                                        <Trash2 size="4" />
                                      </Button>
                                    </div>
                                  )}
                                </SortableItem>
                              ))}
                            </SortableContext>

                            <div className="p-2">
                              <Button className="w-full">
                                <Plus size="4" />
                                Create New Lesson
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  </div>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};
export default CourseStructure;
