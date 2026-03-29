'use client';

import React, { useEffect, useActionState } from 'react';
import { Group, Player } from 'types/nominations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { AdminFieldRow } from 'components/admin/AdminFieldRow';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from 'components/base/Alert';
import { AdminSection } from 'components/admin/AdminSection';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { StatusMessage } from 'types/utilityTypes';
import {
  addPlayerToGroup,
  createGroup,
  deleteGroup,
  removePlayerFromGroup
} from 'app/admin/actions';

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
    <AdminSection title="Group Administration">
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-base font-semibold text-card-foreground">
            Create New Group
          </h3>
          <form action={createGroupAction}>
            <AdminFieldRow>
              <Field className="min-w-40 flex-1">
                <FieldLabel htmlFor="group-name">Group Name</FieldLabel>
                <Input id="group-name" name="groupName" />
              </Field>
              <Field className="min-w-40 flex-1">
                <FieldLabel htmlFor="group-slug">Group Slug</FieldLabel>
                <Input id="group-slug" name="groupSlug" />
              </Field>
              <Field className="min-w-48 flex-1">
                <FieldLabel htmlFor="owner-select">Owner *</FieldLabel>
                <Select name="ownerId" required>
                  <SelectTrigger id="owner-select" className="w-full">
                    <SelectValue placeholder="Select owner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={String(player.id)}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex items-end pb-0.5">
                <Button type="submit">Create</Button>
              </div>
            </AdminFieldRow>
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
                        <Field className="min-w-48 flex-1">
                          <FieldLabel htmlFor={`add-player-${group.id}`}>
                            Add player
                          </FieldLabel>
                          <Select name="playerId">
                            <SelectTrigger
                              id={`add-player-${group.id}`}
                              className="w-full"
                            >
                              <SelectValue placeholder="Select player to add..." />
                            </SelectTrigger>
                            <SelectContent>
                              {playersNotInGroup.map((player) => (
                                <SelectItem
                                  key={player.id}
                                  value={String(player.id)}
                                >
                                  {player.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
      </div>
    </AdminSection>
  );
};
