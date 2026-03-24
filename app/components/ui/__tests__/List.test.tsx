import { render, screen } from "@testing-library/react";
import { Dumbbell } from "lucide-react";
import { List } from "@/app/components/ui/List";

describe("List", () => {
    it("renders header content and items", () => {
        render(
            <List.Root>
                <List.Header>
                    <List.Intro>
                        <List.Heading>
                            <List.Eyebrow>Library</List.Eyebrow>
                            <List.Title>Exercises</List.Title>
                            <List.Description>Browse movements</List.Description>
                        </List.Heading>
                    </List.Intro>
                </List.Header>
                <List.Content layout="grid">
                    <List.Item index={1}>
                        <div>Item A</div>
                    </List.Item>
                </List.Content>
            </List.Root>
        );

        expect(screen.getByText("Exercises")).toBeInTheDocument();
        expect(screen.getByText("Item A")).toBeInTheDocument();
    });

    it("renders empty state", () => {
        render(
            <List.Empty
                icon={Dumbbell}
                title="Nothing here"
                description="Create your first item"
            />
        );

        expect(screen.getByText("Nothing here")).toBeInTheDocument();
    });
});
