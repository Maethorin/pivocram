"""empty message

Revision ID: 52d9ae15c6a9
Revises: bb21c479038b
Create Date: 2016-04-30 15:05:06.944957

"""

# revision identifiers, used by Alembic.
revision = '52d9ae15c6a9'
down_revision = 'bb21c479038b'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('pivotal_token', sa.String()))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'pivotal_token')
    ### end Alembic commands ###