"""Add avatar_url to User model

Revision ID: 1ac7c3935d2a
Revises: dad9e82ab82b
Create Date: 2025-02-25 10:41:34.722739

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1ac7c3935d2a'
down_revision = 'dad9e82ab82b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('avatar_url', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('avatar_url')

    # ### end Alembic commands ###
