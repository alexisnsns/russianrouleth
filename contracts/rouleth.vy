owner: public(address)
players: address[6]
numPlayers: public(uint256)
playerNumbers: HashMap[address, uint256]
lastWinner: public(address)

@external
@payable
@nonreentrant('playLock')
def play():
    if msg.value == 10**16:
        self.numPlayers += 1
        # Add player to the list
        self.players[self.numPlayers - 1] = msg.sender
        self.playerNumbers[msg.sender] = self.numPlayers

        # Check if there are 6 players
        if self.numPlayers == 6:
            # Pick a random winner
            timestamp_bytes: bytes32 = convert(block.timestamp, bytes32)
            hash: bytes32 = sha256(timestamp_bytes)
            winnerIndex: uint256 = convert(hash, uint256) % 6
            winner: address = self.players[winnerIndex]
            self.lastWinner = winner

            # Calculate payout (95% of total balance)
            payout: uint256 = (95 * 6 * 10**16) / 100

            # Send payout to the winner
            send(winner, payout)

            # Calculate casino earnings and send to owner
            casinoEarnings: uint256 = (5 * 6 * 10**16) / 100
            send(self.owner, casinoEarnings)

            # Reset for next round
            self.numPlayers = 0
            for i in range(6):
                if self.players[i] != ZERO_ADDRESS:
                    self.playerNumbers[self.players[i]] = 0
                    self.players[i] = ZERO_ADDRESS
    else:
        # Refund any incorrect amount to the sender
        send(msg.sender, msg.value)

@external
@view
def getPlayerNumber(player: address) -> uint256:
    return self.playerNumbers[player]

@external
@view
def isLastWinner(player: address) -> bool:
    return player == self.lastWinner

@external
@view
def getCurrentNumPlayers() -> uint256:
    return self.numPlayers

@external
@payable
def __default__():
    # Send the received Ether to the owner
    send(self.owner, msg.value)

@external
def __init__():
    self.owner = msg.sender
    self.numPlayers = 0
