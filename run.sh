# run.sh
#!/usr/bin/env bash
set -e

# Activate the Python venv (if you want to use the venv for your scripts)
if [[ -f venv/bin/activate ]]; then
  # shellcheck disable=SC1091
  source venv/bin/activate
fi

# Launch the Python scripts in the background
python picontrol/camera.py &
python picontrol/sensorAPI.py &

# Start the dev server for the garden-site
(
  cd garden-site
  npm run dev
) &

# Wait for all background jobs to finish (or you can exit this script and leave them running)
wait
