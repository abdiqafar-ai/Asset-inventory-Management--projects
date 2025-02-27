"""add avatar

Revision ID: dc8ba112e89a
Revises: 1ac7c3935d2a
Create Date: 2025-02-25 21:21:19.167646

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dc8ba112e89a'
down_revision = '1ac7c3935d2a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('avatars',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('file_name', sa.String(length=255), nullable=False),
    sa.Column('url', sa.String(length=255), nullable=False),
    sa.Column('mime_type', sa.String(length=50), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id')
    )
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('avatar_url')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('avatar_url', sa.VARCHAR(length=255), nullable=True))

    op.drop_table('avatars')
    # ### end Alembic commands ###
