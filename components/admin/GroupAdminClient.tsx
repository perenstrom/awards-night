'use client';

import React, { useEffect, useActionState } from 'react';
import { Group, Player } from 'types/nominations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert } from 'components/base/Alert';
import { StatusMessage } from 'types/utilityTypes';
import {
  addPlayerToGroup,
  createGroup,
  deleteGroup,
  removePlayerFromGroup
} from 'app/admin/actions';

const nativeSelectClassName = cn(
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30'
);

interface Props {
  groups: Group[];
  players: Player[];
}

export const GroupAdminClient: React.FC<Props> = ({ groups, players }) => {
  const [createGroupState, createGroupAction] = useActionState(
    createGroup,
    null
  );
  const [addPlayerState, addPlayerAction] = useActionState(
    addPlayerToGroup,
    null
  );
  const [removePlayerState, removePlayerAction] = useActionState(
    removePlayerFromGroup,
    null
  );
  const [deleteGroupState, deleteGroupAction] = useActionState(
    deleteGroup,
    null
  );

  const currentState: StatusMessage | null =
    createGroupState ||
    addPlayerState ||
    removePlayerState ||
    deleteGroupState ||
    null;

  useEffect(() => {
    if (currentState?.severity === 'success') {
      window.location.reload();
    }
  }, [currentState]);

  const getPlayersInGroup = (groupId: number): Player[] => {
    return players.filter((p) => p.groups.includes(groupId));
  };

  const getPlayersNotInGroup = (groupId: number): Player[] => {
    return players.filter((p) => !p.groups.includes(groupId));
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-xl">Group Administration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-2 text-base font-semibold text-card-foreground">
            Create New Group
          </h3>
          <form action={createGroupAction}>
            <FieldGroup className="flex flex-row flex-wrap items-end gap-4">
              <Field className="min-w-[10rem] flex-1">
                <FieldLabel htmlFor="group-name">Group Name</FieldLabel>
                <Input id="group-name" name="groupName" />
              </Field>
              <Field className="min-w-[10rem] flex-1">
                <FieldLabel htmlFor="group-slug">Group Slug</FieldLabel>
                <Input id="group-slug" name="groupSlug" />
              </Field>
              <Field className="min-w-[12rem] flex-1">
                <FieldLabel htmlFor="owner-select">Owner *</FieldLabel>
                <select
                  id="owner-select"
                  name="ownerId"
                  required
                  className={nativeSelectClassName}
                >
                  <option value="">Select owner...</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex items-end pb-0.5">
                <Button type="submit">Create</Button>
              </div>
            </FieldGroup>
          </form>
        </div>

        {currentState && (
          <div>
            <Alert
              severity={currentState.severity}
              message={currentState.message}
            />
          </div>
        )}

        <div>
          <h3 className="mb-4 text-base font-semibold text-card-foreground">
            Groups
          </h3>
          <div className="space-y-4">
            {groups.map((group) => {
              const groupMembers = getPlayersInGroup(group.id);
              const playersNotInGroup = getPlayersNotInGroup(group.id);

              return (
                <Card key={group.id}>
                  <CardContent className="pt-6">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-semibold text-card-foreground">
                          {group.name || 'Unnamed Group'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Slug: {group.slug}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Owner:{' '}
                          {players.find((p) => p.id === group.ownerId)?.name ||
                            'Unknown'}
                        </p>
                      </div>
                      {groupMembers.length === 0 && (
                        <form action={deleteGroupAction}>
                          <input type="hidden" name="groupId" value={group.id} />
                          <Button type="submit" variant="destructive" size="sm">
                            Delete Group
                          </Button>
                        </form>
                      )}
                    </div>

                    {groupMembers.length > 0 && (
                      <div className="mb-3">
                        <div className="mb-2 font-semibold text-sm text-card-foreground">
                          Members ({groupMembers.length})
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {groupMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-2 rounded-md bg-muted px-3 py-1"
                            >
                              <span className="text-sm text-card-foreground">
                                {member.name}
                              </span>
                              <form
                                action={removePlayerAction}
                                onSubmit={(e) => {
                                  if (
                                    !confirm(
                                      'Are you sure you want to remove this player? They must remain in at least one group.'
                                    )
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <input
                                  type="hidden"
                                  name="groupId"
                                  value={group.id}
                                />
                                <input
                                  type="hidden"
                                  name="playerId"
                                  value={member.id}
                                />
                                <Button
                                  type="submit"
                                  variant="destructive"
                                  size="icon-sm"
                                  aria-label={`Remove ${member.name}`}
                                >
                                  ✕
                                </Button>
                              </form>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {playersNotInGroup.length > 0 && (
                      <form
                        action={addPlayerAction}
                        className="flex flex-wrap items-end gap-2"
                      >
                        <input type="hidden" name="groupId" value={group.id} />
                        <Field className="min-w-[12rem] flex-1">
                          <FieldLabel htmlFor={`add-player-${group.id}`}>
                            Add player
                          </FieldLabel>
                          <select
                            id={`add-player-${group.id}`}
                            name="playerId"
                            className={nativeSelectClassName}
                          >
                            <option value="">Select player to add...</option>
                            {playersNotInGroup.map((player) => (
                              <option key={player.id} value={player.id}>
                                {player.name}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Button type="submit">Add Player</Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
