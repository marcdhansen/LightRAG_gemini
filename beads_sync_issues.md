Beads (often abbreviated as bd) is a git-native, self-healing issue tracker designed for AI-supervised coding workflows, where bd sync issues usually stem from conflicts in its underlying JSONL Git-based data files or synchronization delays. Common problems include lost issues, sync failures between machines, and database corruption during rapid AI agent development.

Here are the common Beads (bd) sync problems and their solutions based on official troubleshooting documentation:

1. Old Data Appears After Reset
Problem: Running bd admin reset --force followed by bd init causes old issues to reappear.
Solution:
Reset Local Database: Run bd admin reset --force.
Delete Remote Branch: Find your sync branch using bd config get sync.branch and delete it from the remote repository: git push origin --delete <sync-branch-name>.
Clear Git History (If needed): If data persists, remove the JSONL file from Git history:

```bash
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .beads/issues.jsonl' \
--prune-empty -- --all
git push origin --force --all
```

1. Issues Lost or Desynced
Problem: bd sync fails to update issues across machines, or AI agents report fewer issues than exist on the remote.
Solution:
Force Pull/Merge: Use bd pull or bd sync --full to force a 3-way merge.
Check Daemon Logs: If the auto-sync fails, check the daemon logs for errors: bd daemon logs.
Manual Recovery: Because Beads uses Git, you can inspect the JSONL history to restore lost issues.

2. Concurrent Edit Conflicts (ID Collisions)
Problem: Multiple AI agents create or update issues simultaneously, leading to bd-10 being created twice in different branches.
Solution:
Use bd sync Often: Regularly sync to keep local state in check.
Assign Unique Work: Define specific, non-overlapping tasks for agents.
Use bd doctor: If corruption occurs, run bd doctor --fix.

3. Sync Branch is Protected
Problem: bd sync fails because the remote repository protects the beads-sync or beads-metadata branch.
Solution:
Unprotect Branch: Remove protection rules for the beads-sync branch, as it is just metadata.
Use Specific Flags: Run with --auto-commit without --auto-push and manually push, or use a different branch name.

4. bd Command Not Found or Not Working
Problem: bd commands fail in a new terminal or folder.
Solution:
Initialize: Ensure you are in a initialized project directory (.beads/ exists).
Check Installation: Verify the CLI works with bd --help.
Fix Hooks: If bd doctor detects lefthook issues, convert lefthook.yml from jobs to commands syntax.

5. Performance Issues / Slow Sync
Problem: The .beads/issues.jsonl file becomes too large (>25k tokens), causing slow processing or agent failures.
Solution:
Close Issues: Frequently close old issues to keep the working set small.
Upgrade: Regularly upgrade to the latest Beads version to get bug fixes for sync performance.

6. "Git Add Failed" due to Local Exclude
Problem: `bd sync` fails with `git add failed` error, claiming the path is ignored, even though `.gitignore` does not exclude `.beads/`.
Cause: `bd init` (or other tools) may populate `.git/info/exclude` with `.beads/` to generically hide the directory, which overrides `.gitignore` allow-lists.
Solution:
Check Exclude File: Run `cat .git/info/exclude`.
Remove Exclusion: Edit the file to remove the `.beads/` line, or run `sed -i '' '/\.beads\//d' .git/info/exclude`.

Best Practices for Avoiding Sync Issues
Run bd doctor Regularly: Periodically run bd doctor [--fix] to resolve broken merges.
Use bd hooks: Install Git hooks to automate syncing (bd hooks install).
Avoid Manual JSONL Editing: Let the bd CLI handle the .beads/ folder.
Use --no-daemon for Worktrees: If using Git worktrees, use bd --no-daemon to avoid daemon conflicts.
