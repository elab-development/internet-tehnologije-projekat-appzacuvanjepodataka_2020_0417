@extends('layouts.app')

@section('content')
<div class="container">
    <h1>My Companies</h1>

    @if (session('status'))
        <div class="alert alert-success">
            {{ session('status') }}
        </div>
    @endif

    <a href="{{ route('companies.create') }}" class="btn btn-primary mb-3">Create New Company</a>

    @if ($companies->isEmpty())
        <p>You don't have any companies yet.</p>
    @else
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($companies as $company)
                    <tr>
                        <td><a href="{{ route('companies.show', $company) }}">{{ $company->name }}</a></td>
                        <td>
                            <form action="{{ route('companies.destroy', $company) }}" method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure?')">Remove</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</div>
@endsection