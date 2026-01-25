'use client';

import React, { useEffect, useActionState } from 'react';
import { Group, Player } from 'types/nominations';
import { Typography } from 'components/base/Typography';
import { Button } from 'components/base/Button';
import { InputField } from 'components/base/InputField';
import { Alert } from 'components/base/Alert';
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

  // Get the latest status message
  const currentState: StatusMessage | null =
    createGroupState ||
    addPlayerState ||
    removePlayerState ||
    deleteGroupState ||
    null;

  // Reload page on success to refresh data
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
    <div className="mt-4 p-4 rounded-md bg-white">
      <Typography variant="h2">Group Administration</Typography>

      {/* Create Group Form */}
      <div className="mt-4">
        <Typography variant="h3">Create New Group</Typography>
        <form action={createGroupAction} className="mt-2">
          <div className="flex gap-4">
            <InputField id="group-name" name="groupName" label="Group Name" />
            <InputField id="group-slug" name="groupSlug" label="Group Slug" />
            <div className="flex items-end">
              <Button type="submit">Create</Button>
            </div>
          </div>
        </form>
      </div>

      {/* Status Messages */}
      {currentState && (
        <div className="mt-4">
          <Alert
            severity={currentState.severity}
            message={currentState.message}
          />
        </div>
      )}

      {/* Groups List */}
      <div className="mt-6">
        <Typography variant="h3">Groups</Typography>
        <div className="mt-4 space-y-4">
          {groups.map((group) => {
            const groupMembers = getPlayersInGroup(group.id);
            const playersNotInGroup = getPlayersNotInGroup(group.id);

            return (
              <div
                key={group.id}
                className="border border-gray-300 rounded-md p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Typography variant="h4">
                      {group.name || 'Unnamed Group'}
                    </Typography>
                    <Typography variant="body" color="black">
                      Slug: {group.slug}
                    </Typography>
                  </div>
                  {groupMembers.length === 0 && (
                    <form action={deleteGroupAction}>
                      <input type="hidden" name="groupId" value={group.id} />
                      <button
                        type="submit"
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete Group
                      </button>
                    </form>
                  )}
                </div>

                {/* Members List */}
                {groupMembers.length > 0 && (
                  <div className="mb-3">
                    <div className="font-semibold mb-2">
                      <Typography variant="body">
                        Members ({groupMembers.length})
                      </Typography>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {groupMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
                        >
                          <span>{member.name}</span>
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
                            <button
                              type="submit"
                              className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white"
                            >
                              ✕
                            </button>
                          </form>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Player Form */}
                {playersNotInGroup.length > 0 && (
                  <form action={addPlayerAction} className="flex gap-2">
                    <input type="hidden" name="groupId" value={group.id} />
                    <select
                      name="playerId"
                      className="border border-gray-300 rounded-md p-2 flex-1"
                    >
                      <option value="">Select player to add...</option>
                      {playersNotInGroup.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                    <Button type="submit">Add Player</Button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
