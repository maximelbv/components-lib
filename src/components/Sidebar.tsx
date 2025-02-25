import { COMPONENTS_PATH, DOC_PATH } from "@/constants/paths";
import { IComponent } from "@/types/components";
import { getAllComponents } from "@/utils/file-utils";
import { formatStringToPath } from "@/utils/string-utils";
import { groupComponentsByCategory } from "@/utils/collection-utils";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import SidebarTag from "./SidebarTag";
import { Box, Stack } from "@chakra-ui/react";

interface ISidebarProps {
  className?: string;
}

export interface GroupedComponent {
  name: string;
  status?: string;
}

const Sidebar = ({ className }: ISidebarProps) => {
  const [categories, setCategories] = useState<
    Record<string, GroupedComponent[]>
  >({});

  useEffect(() => {
    const components = getAllComponents() as IComponent[];
    const grouped = groupComponentsByCategory(components);

    setCategories(grouped);
  }, []);

  return (
    <Box className="!w-[225px] !pl-4">
      <Box className={`${className} flex flex-col gap-3`} position="fixed">
        {Object.entries(categories).map(([category, elements]) => (
          <Category key={category} name={category} elements={elements} />
        ))}
      </Box>
    </Box>
  );
};

const Category = ({
  name,
  elements,
}: {
  name: string;
  elements: GroupedComponent[];
}) => {
  return (
    <Box className="flex flex-col">
      {name && <span className="!text-[18px] !font-bold !py-4">{name}</span>}
      <Stack gap={3} pl={4} borderLeft={"1px solid #ffffff1c"}>
        {elements.map((elem: GroupedComponent) => {
          const { name, status } = elem;
          const path = `/${DOC_PATH}/${COMPONENTS_PATH}/${formatStringToPath(
            name
          )}`;

          const isActive = location.pathname === path;

          return (
            <Link
              key={path}
              className={`
                ${
                  isActive
                    ? "text-text-primary before:bg-text-primary"
                    : "!text-text-muted"
                }
                relative group flex items-center gap-1.5
                before:content-[''] before:w-[1px] before:h-[16px]
                before:bg-none before:top-1/2 before:-translate-y-1/2
                before:left-[-17px] before:absolute before:rounded-full
                before:transition before:ease-out before:duration-200
              `}
              to={path}
            >
              <span className="group-hover:text-text-primary !text-[14px] !font-medium custom-text-hover-anim">
                {name}
              </span>
              {status && <SidebarTag type={status} />}
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Sidebar;
