const Id = x => 
({
    map: f => Id(f(x)),
    chain: f => f(x),
    extract: () => x,
    concat: other => Id(x.concat(o.extract()))
})

const Either = (() => {
    const Right = x => ({
        chain: f => f(x), // flatMap
        map: f => Right(f(x)),
        fold: (f, g) => g(x),
        concat: other =>
            other.fold(x => other, y => Right(x.concat(y))),
        toString: () => `Right (${x})`
    })


    const Left = x => ({
        chain: f => Left(x),
        map: _ => Left(x),
        fold: (f, g) => f(x),
        concat: f => Left(x),
        toString: () => `Left (${x})`
    })

    const of = Right

    const tryCatch = f => {
        try {
            return Right(f())
        } catch (e) {
            return Left(e)
        }
    }

    const fromNullable = x => 
        x == null ? Left(x) : Right(x)

    return {Right, Left, of, tryCatch, fromNullable}
})()

const Predicate = run => ({
    run,
    contramap: f => Predicate(x => run(f(x))),
    // concat: other => Pred(x => other.run(x).concat(run(x)))
    concat: other => Predicate(x => run(x) && other.run(x))
})

module.exports = {Id, Either, Predicate} 