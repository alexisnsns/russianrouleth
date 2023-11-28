owner: public(address)
players: address[6]
numPlayers: public(uint256)
totalBalance: public(uint256)
casinoBalance: public(uint256)
locked: public(bool)


@external
@view
def greet() -> String[11]:
    return "hello, anon"

@external
@payable
def play():
    assert not self.locked, "Reentrancy protection"

    # Check if the correct amount is sent
    if msg.value == 10**16:
      self.locked = True

      # Add player to the list
      self.players[self.numPlayers] = msg.sender
      self.numPlayers += 1

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

        self.locked = False
      else:
          self.locked = False
    else:
      # If the incorrect amount is sent, send it to the owner
      send(self.owner, msg.value)

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
