import { useMemo, useState } from "react";
function getPrimes(limit: number): number[] {
  const isPrime = Array(limit + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }

  return isPrime
    .map((v, i) => (v ? i : null))
    .filter((v): v is number => v !== null);
}

export default function PrimeSieve() {
  const [limit, setLimit] = useState(10000);
  const [count, setCount] = useState(0); // unrelated state

  const primes = useMemo(() => {
    console.log("소수 계산 실행!");
    return getPrimes(limit);
  }, [limit]);

  return (
    <div>
      <h2>에라토스테네스의 체</h2>

      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
      />

      <p>소수 개수: {primes.length}</p>

      <button onClick={() => setCount(c => c + 1)}>
        다른 상태 변경 ({count})
      </button>
    </div>
  );
}
