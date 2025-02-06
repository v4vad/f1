# Changelog

## [Unreleased]

### Added
- Lap time deltas showing time difference from previous lap
  - Color coded: green for faster laps, red for slower laps
  - Displayed inline next to lap times
- Pit stop information in lap times table
  - Yellow background highlighting for pit stop laps
  - Shows pit stop duration and stop number
  - Commit: `6e82383` - Can be reverted if needed

### Technical Details
To revert these changes:
```bash
# Option 1: Create a new commit that undoes these changes
git revert 6e82383

# Option 2: Remove the commit (use with caution)
git reset --hard HEAD^
``` 