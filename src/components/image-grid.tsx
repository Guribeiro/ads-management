import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Image {
  id: string;
  src: string;
  alt: string;
  active: boolean;
  order: number;
}

interface ImageGridProps {
  images?: Image[];
  onToggleActive?: (id: string, active: boolean) => void;
  onReorder?: (startIndex: number, endIndex: number) => void;
  onSearch?: (query: string) => void;
}

const ImageGrid = ({
  images = [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
      alt: "Abstract gradient 1",
      active: true,
      order: 0,
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&q=80",
      alt: "Abstract gradient 2",
      active: false,
      order: 1,
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=400&q=80",
      alt: "Abstract gradient 3",
      active: true,
      order: 2,
    },
    {
      id: "4",
      src: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80",
      alt: "Abstract gradient 4",
      active: false,
      order: 3,
    },
    {
      id: "5",
      src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80",
      alt: "Abstract gradient 5",
      active: true,
      order: 4,
    },
    {
      id: "6",
      src: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400&q=80",
      alt: "Abstract gradient 6",
      active: true,
      order: 5,
    },
  ],
  onToggleActive = () => { },
  onReorder = () => { },
  onSearch = () => { },
}: ImageGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedImages, setSortedImages] = useState<Image[]>(images);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Handle drag end event
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const reorderedImages = Array.from(sortedImages);
    const [removed] = reorderedImages.splice(startIndex, 1);
    reorderedImages.splice(endIndex, 0, removed);

    setSortedImages(reorderedImages);
    onReorder(startIndex, endIndex);
  };

  // Handle toggle switch for image activation
  const handleToggleActive = (id: string, active: boolean) => {
    onToggleActive(id, active);

    // Update local state to reflect the change
    setSortedImages((prevImages) =>
      prevImages.map((img) => (img.id === id ? { ...img, active } : img)),
    );
  };

  return (
    <div className="w-full bg-background p-4">
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search images..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Image grid with drag and drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {sortedImages.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                    >
                      <Card className="overflow-hidden h-full">
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="object-cover w-full h-full transition-opacity"
                            style={{ opacity: image.active ? 1 : 0.5 }}
                          />
                          <Badge
                            className="absolute top-2 right-2"
                            variant={image.active ? "default" : "outline"}
                          >
                            {image.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="text-sm truncate">{image.alt}</div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {image.active ? "On" : "Off"}
                            </span>
                            <Switch
                              checked={image.active}
                              onCheckedChange={(checked) =>
                                handleToggleActive(image.id, checked)
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty state */}
      {sortedImages.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-muted-foreground mb-2">No images found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or add new images to the carousel.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
