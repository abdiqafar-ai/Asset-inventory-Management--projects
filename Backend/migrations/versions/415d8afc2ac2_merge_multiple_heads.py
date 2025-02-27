"""Merge multiple heads

Revision ID: 415d8afc2ac2
Revises: 743df60c4bbf, dc8ba112e89a
Create Date: 2025-02-27 13:51:30.620402

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '415d8afc2ac2'
down_revision = ('743df60c4bbf', 'dc8ba112e89a')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
