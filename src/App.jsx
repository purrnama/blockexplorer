import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";
import Header from "./components/Header";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: import.meta.env.VITE_REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [gasPrice, setGasPrice] = useState();
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }
    async function getGasPrice() {
      setGasPrice(Utils.formatUnits(await alchemy.core.getGasPrice(), "gwei"));
    }
    async function getLatestBlocks() {
      const blocks = [];
      for (let i = blockNumber; i > blockNumber - 6; i--) {
        blocks.push(await alchemy.core.getBlock(i));
      }
      setLatestBlocks(blocks);
    }
    async function getLatestTransactions() {
      const latestTx = (
        await alchemy.core.getBlockWithTransactions("latest")
      ).transactions.slice(0, 6);
      setLatestTransactions(latestTx);
    }
    getBlockNumber();
    getGasPrice();
    getLatestBlocks();
    getLatestTransactions();
  }, [setBlockNumber, setGasPrice, setLatestTransactions, blockNumber]);

  return (
    <div className="font-sans">
      <Header />
      <div className="container mx-auto grid grid-cols-2 gap-4">
        <div className="border py-4  text-center">
          <h2 className="font-bold text-2xl">Latest Block Number</h2>
          <p>
            <span className="font-mono">{blockNumber}</span>
          </p>
        </div>
        <div className="border py-4 text-center">
          <h2 className="font-bold text-2xl">Gas Price</h2>
          <p>
            <span className="font-mono">{gasPrice}</span> Gwei
          </p>
        </div>
        <div className="border py-4">
          <h2 className="font-bold text-2xl text-center">Latest Blocks</h2>
          <ul>
            {latestBlocks.map((blk, i) => (
              <li key={i}>
                <div className="border flex flex-row gap-8 px-4 py-2 m-2 items-center">
                  <p>
                    <span className="font-mono">{blk.number}</span>
                  </p>
                  <div>
                    <p>
                      <span className="font-bold">Miner: </span>
                      <span className="font-mono">
                        {blk.miner.slice(0, 8) + "..." + blk.miner.slice(-8)}
                      </span>
                    </p>
                    <p>
                      <span className="font-bold">Transactions: </span>
                      <span className="font-mono">
                        {blk.transactions.length}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="border py-4">
          <h2 className="font-bold text-2xl text-center">
            Latest Transactions
          </h2>
          <ul>
            {latestTransactions.map((tx, i) => (
              <li key={i}>
                <div className="border flex flex-row gap-8 px-4 py-2 m-2 items-center">
                  <p>
                    <span className="font-mono">
                      {tx.hash.slice(0, 10) + ".. "}
                    </span>
                  </p>
                  <div>
                    <p>
                      <span className="font-bold">From: </span>
                      <span className="font-mono">
                        {tx.from.slice(0, 8) + "..." + tx.from.slice(-8)}
                      </span>
                    </p>
                    <p>
                      <span className="font-bold">To: </span>
                      <span className="font-mono">
                        {tx.to.slice(0, 8) + "..." + tx.to.slice(-8)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-mono">
                        {Utils.formatEther(tx.value)}
                      </span>{" "}
                      ETH
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
