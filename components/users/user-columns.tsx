"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";

function ActiveSwitch({ id, isActive }: { id: string; isActive: boolean }) {
  const [checked, setChecked] = useState(isActive);

  return (
    <Switch
      checked={checked}
      onCheckedChange={async (value) => {
        setChecked(value);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: value }),
        });
      }}
    />
  );
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
};

export const UserColumns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "Prénom",
  },
  {
    accessorKey: "lastName",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isActive",
    header: "Activé",
    cell: ({ row }) => (
      <ActiveSwitch id={row.original._id} isActive={row.getValue("isActive")} />
    ),
  },
];
