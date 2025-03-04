import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'room_{self.room_code}'

        # Añadir la conexión al grupo de la sala
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Eliminar la conexión del grupo de la sala
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print('Disconnected!')

    async def receive(self, text_data):
        receive_dict = json.loads(text_data)
        message = receive_dict['message']
        action = receive_dict['action']

        if action in ['new-offer', 'new-answer']:
            receiver_channel_name = receive_dict['message']['receiver_channel_name']
            receive_dict['message']['receiver_channel_name'] = self.channel_name

            # Enviar el mensaje al WebSocket del receptor
            await self.channel_layer.send(
                receiver_channel_name,
                {
                    'type': 'send.sdp',
                    'receive_dict': receive_dict
                }
            )
            return

        # Enviar el mensaje a todos los miembros del grupo de la sala
        receive_dict['message']['receiver_channel_name'] = self.channel_name
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send.sdp',
                'receive_dict': receive_dict
            }
        )

    async def send_sdp(self, event):
        # Enviar el SDP al cliente
        receive_dict = event['receive_dict']
        await self.send(text_data=json.dumps(receive_dict))
