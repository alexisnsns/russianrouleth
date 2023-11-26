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
    assert msg.value == 0.01 * 10**18, "Send 0.01 ETH"

    self.locked = True

    # Add player to the list
    self.players[self.numPlayers] = msg.sender
    self.numPlayers += 1

    # Increment total balance
    self.totalBalance += msg.value

    # Check if there are 6 players
    if self.numPlayers == 6:
        # Pick a random winner
        winnerIndex: uint256 = convert(sha256(block.timestamp), uint256) % 6
        winner: address = self.players[winnerIndex]

        # Calculate payout (95% of total balance)
        payout: uint256 = self.totalBalance * 95 / 100

        # Calculate casino earnings and add to casino balance
        casinoEarnings: uint256 = self.totalBalance - payout
        self.casinoBalance += casinoEarnings

        # Reset for next round
        self.numPlayers = 0
        self.totalBalance = 0

        self.locked = False

        # Send payout to the winner
        send(winner, payout)
    else:
        self.locked = False

@external
def withdrawCasinoFunds():
    assert msg.sender == self.owner, "Only owner can withdraw"
    self.locked = True
    send(self.owner, self.casinoBalance)
    self.casinoBalance = 0
    self.locked = False

@external
def __init__():
    self.owner = msg.sender
    self.numPlayers = 0
    self.totalBalance = 0
    self.casinoBalance = 0
    self.locked = False
