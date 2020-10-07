"""
Dynamically adds environment variables to the app.yaml file
"""

import yaml
import os

# This is the base app.yaml file which gets
# environment variables dynamically injected
# at build time (for staging / prod)
app_yaml_base = """
  runtime: custom
  env: flex
  manual_scaling:
    instances: 1
  env_variables:
    NODE_PATH: "./build"
"""

# convert raw yaml string into a dict
obj = yaml.safe_load(app_yaml_base)

# dynamically add sensitive environment variables
obj['env_variables'].update({
  "CRON_INTERVAL_MS": os.environ['CRON_INTERVAL_MS'],
  "DATABASE_URL": os.environ['DATABASE_URL'],
})

print(yaml.dump(obj, default_flow_style=False))

