owner: public(address)
players: address[6]
numPlayers: public(uint256)
totalBalance: public(uint256)
casinoBalance: public(uint256)
locked: public(bool)
playerNumbers: HashMap[address, uint256]

@external
@payable
def play():
    assert not self.locked, "Reentrancy protection"

    if msg.value == 10**16:
        self.locked = True

        self.numPlayers += 1
        # Add player to the list
        self.players[self.numPlayers - 1] = msg.sender
        self.playerNumbers[msg.sender] = self.numPlayers

        # Increment total balance
        self.totalBalance += msg.value

        # Check if there are 6 players
        if self.numPlayers == 6:
            # Pick a random winner
            timestamp_bytes: bytes32 = convert(block.timestamp, bytes32)
            hash: bytes32 = sha256(timestamp_bytes)
            winnerIndex: uint256 = convert(hash, uint256) % 6
            winner: address = self.players[winnerIndex]

            # Calculate payout (95% of total balance)
            payout: uint256 = self.totalBalance * 95 / 100

            # Send payout to the winner
            send(winner, payout)

            # Calculate casino earnings and send to owner
            casinoEarnings: uint256 = self.totalBalance - payout
            send(self.owner, casinoEarnings)

            # Reset for next round
            self.numPlayers = 0
            self.totalBalance = 0
            for i in range(6):
                self.players[i] = ZERO_ADDRESS  # Reset each player in the array
                if self.playerNumbers[self.players[i]] != 0:
                    self.playerNumbers[self.players[i]] = 0  # Reset player number mapping

            self.locked = False
        else:
            self.locked = False

    else:
        # Refund the incorrect amount to the sender
        send(msg.sender, msg.value)


@external
@view
def getPlayerNumber(player: address) -> uint256:
    return self.playerNumbers[player]

@external
@payable
def __default__():
    # Send the received Ether to the owner
    send(self.owner, msg.value)

@external
def __init__():
    self.owner = msg.sender
    self.numPlayers = 0
    self.totalBalance = 0
    self.casinoBalance = 0
    self.locked = False
