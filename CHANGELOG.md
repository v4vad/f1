# Changelog

## [Unreleased]

### Added
- Lap time deltas showing time difference from previous lap
  - Color coded: green for faster laps, red for slower laps
  - Displayed inline next to lap times in parentheses
  - Delta calculation in seconds with 3 decimal precision
- Pit stop information in lap times table
  - Yellow background highlighting for pit stop laps
  - Shows pit stop duration and stop number
  - Integrated with lap times display
- Error handling and loading states
  - Added error messages for all API failures
  - Added loading indicators for all async operations
  - Proper error display in UI with contextual messages
  - Loading states for season, race, and lap time selections

### Improved
- Type safety and code quality
  - Added proper TypeScript interfaces for pit stops
  - Fixed theme provider type definitions
  - Removed usage of 'any' type across the application
  - Better type safety in API responses
- UI/UX Enhancements
  - Added Geist font for better typography
  - Improved loading states visibility
  - Better error message presentation
  - Responsive layout improvements
  - Dark mode support with proper color schemes
  - Better contrast for status indicators
- Data Processing
  - Better handling of lap time calculations
  - Proper filtering of invalid lap times
  - Improved pit stop data integration
  - Better state management for selections

### Fixed
- Fixed duplicate lap time entries
- Fixed theme provider type errors
- Fixed build issues for production deployment
- Fixed dark mode color contrasts
- Fixed loading state cleanup

### Technical Details
Notable commits:
- `6e82383` - Added lap time deltas and pit stops
- `af0b0c7` - Project configuration and components

To revert these changes:
```bash
# Option 1: Create a new commit that undoes these changes
git revert 6e82383    # Revert lap time deltas and pit stops
git revert af0b0c7    # Revert project configuration

# Option 2: Remove the commits (use with caution)
git reset --hard HEAD~2
``` 