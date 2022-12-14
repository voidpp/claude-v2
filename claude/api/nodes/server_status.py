from pydantic import BaseModel

from claude.components.graphene.node_base import NodeBase, NodeConfig
from claude.components.graphene.pydantic import object_type_from_pydantic
from claude.components.server_status.fetcher import get_server_ping, get_server_status
from claude.components.server_status.types import ServerStatusResponse
from claude.components.tools import TaskGatherer


class ServerStatusNodeValidator(BaseModel):
    ip: str
    status_server_port: int


class ServerStatusNode(NodeBase[ServerStatusNodeValidator]):
    config = NodeConfig(
        result_type=object_type_from_pydantic(ServerStatusResponse),
        input_validator=ServerStatusNodeValidator,
    )

    async def resolve(self):
        tasks = TaskGatherer()
        if self.is_field_queried("status"):
            tasks.append_task(get_server_status(self.args.ip, self.args.status_server_port), "status")

        if self.is_field_queried("ping"):
            tasks.append_task(get_server_ping(self.args.ip), "ping")

        results = await tasks.wait()
        return ServerStatusResponse(**results)
